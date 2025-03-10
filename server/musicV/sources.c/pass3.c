#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#define MAX_LINE 256
#define I_SIZE 15000
#define P_SIZE 100
#define IP_SIZE 21
#define T_SIZE 50
#define SAMPLE_RATE 44100
#define BUFFER_SIZE 1536

int I[I_SIZE] = {0};
float P[P_SIZE] = {0};
int IP[IP_SIZE] = {12, 512, 44100, 14500, 14400, 512, 13000, 35, 40, 6657, 2048, 1000000, 6657, 512, 7777777, 0, 0, 0, 0, 0, 0};
int PEAK = 0, NRSOR = 0;
float T[T_SIZE] = {0}, TI[T_SIZE] = {0};
int ITI[T_SIZE] = {0};

void error(int type) {
    printf(" ERROR OF TYPE %d\n", type);
}

void data(char *input_buffer, int *pos, int input_size) {
    char line[MAX_LINE];
    int line_pos = 0;
    I[0] = 0;
    while (*pos < input_size && line_pos < MAX_LINE - 1) {
        char c = input_buffer[*pos];
        if (c == '\n' || c == '\0') {
            (*pos)++;
            break;
        }
        line[line_pos++] = c;
        (*pos)++;
    }
    line[line_pos] = '\0';
    if (line_pos == 0) return;
    int k;
    if (sscanf(line, "%d", &k) != 1 || k <= 0) return;
    I[0] = k;
    char *token = strtok(line, " ");
    token = strtok(NULL, " ");
    for (int j = 0; j < k && token; j++) {
        P[j + 1] = atof(token);
        token = strtok(NULL, " ");
    }
    printf("Data: k=%d, P=", k);
    for (int j = 1; j <= k; j++) printf("%f ", P[j]);
    printf("\n");
}

void gen1() {
    int n1 = IP[1] + ((int)P[4] - 1) * IP[5];
    int m1 = 7;
    float sclft = IP[14];
label_102:
    if (P[m1 + 1] <= 0.0) {
        I[(int)P[m1 + 1] + 1] = (int)(P[m1] * sclft);
        return;
    }
    float v1 = P[m1 - 2] * sclft;
    float v2 = (P[m1] - P[m1 - 2]) / (P[m1 + 1] - P[m1 - 1]) * sclft;
    int ma = n1 + (int)P[m1 - 1];
    int mb = n1 + (int)P[m1 + 1] - 1;
    for (int j = ma; j <= mb; j++) {
        float xj = j - ma;
        I[j] = (int)(v1 + v2 * xj);
    }
    if ((int)P[m1 + 1] == IP[5] - 1) {
        I[mb + 1] = (int)(P[m1] * sclft);
        return;
    }
    m1 += 2;
    goto label_102;
}

void samout(int idsk, int n, FILE *output) {
    static int idbuf[BUFFER_SIZE];
    int m1 = IP[9];
    int isc = IP[11];
    if (idsk + n > BUFFER_SIZE) n = BUFFER_SIZE - idsk; // Prevent overflow
    printf("Samout: idsk=%d, n=%d, m1=%d\n", idsk, n, m1);
    for (int k = 0; k < n; k++) {
        int n1 = I[m1 + k] / isc;
        if (n1 > PEAK) PEAK = n1;
        idbuf[idsk + k] = n1;
        if (k < 5) printf("idbuf[%d]=%d ", idsk + k, idbuf[idsk + k]);
    }
    printf("\nWriting %d samples\n", n);
    for (int k = 0; k < n; k++) {
        float sample = idbuf[idsk + k] * 0.000488f;
        size_t written = fwrite(&sample, sizeof(float), 1, output);
        if (written != 1) printf("Write failed at k=%d\n", k);
    }
    fflush(output);
}

void forsam(int ins_start, int mout) {
    float sfi = 1.0f / IP[11];
    int n1 = I[5] + 2;
    int n2 = I[n1 - 1];
    int l[8] = {0}, m[8] = {0};
    printf("FORSAM: n1=%d, n2=%d, I[5]=%d\n", n1, n2, I[5]);
    if (n2 < n1 || n1 >= I_SIZE || n2 >= I_SIZE) {
        printf("Invalid bounds: n1=%d, n2=%d\n", n1, n2);
        return;
    }
    for (int j1 = n1; j1 <= n2; j1++) {
        int j2 = j1 - n1 + 1;
        if (I[j1] >= 0) {
            m[j2 - 1] = 0;
            l[j2 - 1] = I[j1];
        } else {
            l[j2 - 1] = -I[j1];
            m[j2 - 1] = 1;
        }
        printf("j1=%d, l[%d]=%d, m[%d]=%d\n", j1, j2 - 1, l[j2 - 1], j2 - 1, m[j2 - 1]);
    }
    int nsam = I[4];
    int ngen = I[n1 - 2] - 100;
    printf("NGEN=%d, NSAM=%d\n", ngen, nsam);
    if (ngen == 1) { // OSC
        float sum = 0.0f;
        float amp = P[3] * 1000000.0f; // Scale amplitude
        float freq = P[5] / SAMPLE_RATE; // Hz to sample rate
        printf("OSC: sum=%f, amp=%f, freq=%f\n", sum, amp, freq);
        for (int j3 = 0; j3 < nsam && j3 < I_SIZE - mout; j3++) {
            int j5 = mout + j3;
            I[j5] = (int)(amp * sinf(sum * 2 * 3.14159f));
            sum += freq;
            if (j3 < 5) printf("j3=%d, I[%d]=%d\n", j3, j5, I[j5]);
        }
    } else if (ngen == 0) { // OUT
        int in1 = m[0] ? 0 : I[l[0]];
        for (int j3 = 0; j3 < nsam && j3 < I_SIZE - mout; j3++) {
            if (m[0]) {
                int j4 = l[0] + j3;
                in1 = (j4 < I_SIZE) ? I[j4] : 0;
            }
            int j5 = l[1] + j3;
            if (j5 < I_SIZE) I[j5] += in1;
        }
    }
}

char *pass3(char *input_buffer, int input_size) {
    char *output_buffer = (char *)malloc(4096);
    if (!output_buffer) {
        printf("Failed to allocate output buffer\n");
        return NULL;
    }

    FILE *output = fopen("snd.raw", "wb");
    if (!output) {
        printf("File error\n");
        free(output_buffer);
        return NULL;
    }

    I[6] = 976545367;
    int ip9 = IP[8];
    int sclft = IP[11];
    I[1] = IP[3];
    int ms1 = IP[6];
    int ms3 = ms1 + (IP[7] * IP[8]) - 1;
    int ms2 = IP[7];
    I[3] = IP[2];
    int mout = IP[9];
    int idsk = 0;

label_5:
    T[0] = 0.0;
    for (int n1 = ms1; n1 <= ms3; n1 += ms2) I[n1] = -1;
    for (int n1 = 0; n1 < ip9; n1++) TI[n1] = 1000000.0;

    int pos = 0;
label_204:
    data(input_buffer, &pos, input_size);
    if (pos >= input_size && I[0] == 0) goto label_6;
    printf("P[1]=%f, T[0]=%f, P[2]=%f\n", P[1], T[0], P[2]);
    if (P[2] > T[0]) goto label_244;
label_200:
    int iop = (int)P[1];
    if (iop <= 0) {
        error(1);
        goto label_204;
    }
    if (IP[0] < iop) {
        error(1);
        goto label_204;
    }
    switch (iop) {
        case 1: {
            int m1 = -1;
            for (int n1 = ms1; n1 <= ms3; n1 += ms2) {
                if (I[n1] == -1) {
                    m1 = n1;
                    break;
                }
            }
            if (m1 == -1) {
                error(2);
                goto label_204;
            }
            int m2 = m1 + I[0] - 1;
            int m3 = m2 + 1;
            int m4 = m1 + IP[7] - 1;
            for (int n1 = m1; n1 <= m2; n1++) I[n1] = (int)(P[n1 - m1 + 1] * sclft);
            I[m1] = (int)P[3];
            for (int n1 = m3; n1 <= m4; n1++) I[n1] = 0;
            for (int n1 = 0; n1 < ip9; n1++) {
                if (TI[n1] == 1000000.0) {
                    TI[n1] = P[2] + P[4];
                    ITI[n1] = m1;
                    printf("Note scheduled: TI[%d]=%f\n", n1, TI[n1]);
                    goto label_204;
                }
            }
            error(3);
            goto label_204;
        }
        case 2: {
            int m1 = I[1];
            int m2 = IP[4] + (int)P[3];
            I[m2] = m1;
label_218:
            data(input_buffer, &pos, input_size);
            if (pos >= input_size && I[0] == 0) goto label_6;
            if (I[0] <= 2) {
                I[m1] = 0;
                I[1] = m1 + 1;
                goto label_204;
            }
            I[m1] = (int)P[3];
            int m3 = I[0];
            I[m1 + 1] = m1 + m3 - 2; // Adjusted for correct block size
            m1 += 2;
            for (int n1 = 4; n1 <= m3; n1++) {
                int m5 = (int)P[n1];
                if (m5 < 0) {
                    if (m5 + 100 >= 0) I[m1] = -IP[12] + (m5 + 1) * IP[13];
                    else I[m1] = -IP[1] + (m5 + 101) * IP[5];
                } else if (m5 > 100) {
                    I[m1] = m5 + 262144;
                } else {
                    I[m1] = m5;
                }
                m1++;
            }
            goto label_218;
        }
        case 3:
            gen1();
            goto label_204;
        case 6:
label_6:
            printf("Terminating\n");
            int k = IP[9];
            int l = k + IP[13] - 1;
            for (int j = k; j <= l; j++) I[j] = 0;
            samout(idsk, IP[13], output);
            printf(" END OF PASS III\n");
            fclose(output);
            FILE *params = fopen("snd_params.txt", "w");
            fprintf(params, "%d %d\n", I[7] + 1, I[3]);
            fclose(params);
            snprintf(output_buffer, 4096, "Pass 3 complete");
            return output_buffer;
        default:
            error(1);
            goto label_204;
    }

label_244:
    T[1] = P[2];
label_250:
    float tmin = 1000000.0;
    int mnote = -1;
    for (int n1 = 0; n1 < ip9; n1++) {
        if (tmin > TI[n1]) {
            tmin = TI[n1];
            mnote = n1;
        }
    }
    printf("TMIN=%f\n", tmin);
    if (tmin >= T[1] || tmin == 1000000.0) {
        T[2] = T[1];
    } else {
        T[2] = tmin;
    }
label_260:
    int isam = (int)((T[2] - T[0]) * I[3] + 0.5);
    T[0] = T[2];
    printf("ISAM=%d, T[0]=%f\n", isam, T[0]);
    if (isam > 0) {
        I[4] = isam;
        while (isam > 0) {
            int msamp = isam > IP[13] ? IP[13] : isam;
            int m3 = I[7] ? mout + (2 * msamp) - 1 : mout + msamp - 1;
            if (m3 >= I_SIZE) break;
            for (int n1 = mout; n1 <= m3; n1++) I[n1] = 0;
            for (int ns1 = ms1; ns1 <= ms3; ns1 += ms2) {
                if (I[ns1] != -1) {
                    I[2] = ns1;
                    int igen = IP[4] + I[ns1];
                    if (igen >= I_SIZE) break;
                    igen = I[igen];
                    printf("INS: I[%d]=%d\n", ns1, I[ns1]);
                    I[5] = igen;
                    forsam(ns1, mout);
                    break;
                }
            }
            samout(idsk, msamp, output);
            idsk += msamp;
            isam -= msamp;
        }
    }
    if (mnote >= 0 && tmin < 1000000.0) {
        TI[mnote] = 1000000.0;
        I[ITI[mnote]] = -1;
        printf("Note %d ended, TI[%d]=%f\n", mnote, mnote, TI[mnote]);
        goto label_250;
    }
    goto label_204;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
char *run_pass3(char *input, int input_size) {
    return pass3(input, input_size);
}
#endif