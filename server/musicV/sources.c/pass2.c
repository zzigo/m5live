#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#define MAX_LINE 256
#define NPAR 10000
#define NCAR 1000
#define NOPC 12

float G[1000] = {0};
int I[1000] = {0};
float T[1000] = {0};
float D[10000] = {0};
float P[100] = {0};
int IP[10] = {0};
int IXJQ = 0;
float TLAST = 0.0, BLAST = 0.0;

void error(int type) {
    printf(" ERROR OF TYPE %d\n", type);
}

void read2(char *input_buffer, int *pos, int input_size) {
    char line[MAX_LINE];
    int line_pos = 0;
    IP[1] = 0;
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
    printf("Read line: %s", line);
    int k;
    if (sscanf(line, "%d", &k) != 1 || k <= 0) {
        IP[1] = 0;
        return;
    }
    IP[1] = k;
    char *token = strtok(line, " ");
    token = strtok(NULL, " ");
    for (int j = 1; j <= k && token; j++) {
        P[j] = atof(token);
        token = strtok(NULL, " ");
    }
    printf("Parsed: k=%d, P=", k);
    for (int j = 1; j <= k; j++) printf("%f ", P[j]);
    printf("\n");
}

void sort(float *a, int n, int *l) {
    int n1 = n - 1;
    for (int i = 0; i < n1; i++) {
        int in = i + 1;
        for (int j = in; j < n; j++) {
            if (a[i] <= a[j]) continue;
            float t = a[i];
            a[i] = a[j];
            a[j] = t;
            int nt = l[i];
            l[i] = l[j];
            l[j] = nt;
        }
    }
}

float con(float *g, int i, float t) {
    return 1.0; // Stub—Pass 3 will set G
}

void convt() {
    if (G[3] != 0.0 || P[1] != 1.0) return;
    float freq = 511.0 / G[4];
    int i = (int)P[3];
    int npar = (int)G[10 * i];
    if (npar == 0) {
        P[5] = P[5] * freq;
        return;
    }
    for (int j = 1; j <= npar; j++) {
        int m = (int)G[10 * i + j];
        if (m > 200) {
            m -= 200;
            float d = -(6.2832 * P[m+1]) / G[4];
            float f = (6.2832 * P[m]) / G[4];
            P[m] = 2.0 * expf(d) * cosf(f);
            P[m+1] = expf(2.0 * d);
        } else if (m > 100) {
            m -= 100;
            P[m+1] = P[4] - P[m] - P[m+2];
            if (P[m+1] < 0) {
                P[m] = (P[m] * P[4]) / (P[m] + P[m+2]);
                P[m+2] = (P[m+2] * P[4]) / (P[m] + P[m+2]);
                P[m+1] = 128;
            } else if (P[m+1] == 0) {
                P[m+1] = 128;
            } else {
                P[m+1] = freq / (4.0 * P[m+1]);
                P[m+2] = freq / (4.0 * P[m]);
            }
        } else if (m < 0) {
            m = -m;
            P[m] = freq / P[m];
        } else {
            P[m] = freq * P[m];
        }
    }
}

void write2(char *output_buffer, int *output_pos) {
    if (IP[1] == 0) return;
    if (G[2] != 0.0) { // Only adjust if G[2] set
        float x = P[2];
        float y = P[4];
        int iloc = (int)G[2];
        if (P[1] == 1.0) P[4] = P[4] * 60.0 / con(G, iloc, P[2]);
        P[2] = TLAST + (P[2] - BLAST) * 60.0 / con(G, iloc, P[2]);
        TLAST = P[2];
        BLAST = x;
    }
    convt();
    int k = IP[1];
    char temp[MAX_LINE];
    int len = snprintf(temp, MAX_LINE, "%d", k);
    for (int j = 1; j <= k; j++) len += snprintf(temp + len, MAX_LINE - len, " %f", P[j]);
    temp[len++] = '\n';
    temp[len] = '\0';
    if (*output_pos + len < 4096) {
        memcpy(output_buffer + *output_pos, temp, len);
        *output_pos += len;
    }
    printf("Wrote: %s", temp);
}

char *pass2(char *input_buffer, int input_size) {
    char *output_buffer = (char *)malloc(4096);
    if (!output_buffer) {
        printf("Failed to allocate output buffer\n");
        return NULL;
    }
    int output_pos = 0;

    G[4] = 44100.0;
    int iend = 0, pos = 0;

label_150:
    {
        int id = 1, in = 1;
        TLAST = 0.0;
        BLAST = 0.0;

        while (pos < input_size) {
label_106:
            read2(input_buffer, &pos, input_size);
            if (IP[1] == 0) {
                if (pos >= input_size) break;
                continue;
            }
            int i1 = IP[1];
            D[id] = i1;
            I[in] = id;
            T[in] = P[2];
            for (int i2 = 1; i2 <= i1; i2++) D[id + i2] = P[i2];
            id += i1 + 1;
            printf("ID=%d, IN=%d\n", id, in);
            if (id > NPAR) {
                error(20);
                goto cleanup;
            }
            in++;
            if (in > NCAR) {
                error(20);
                goto cleanup;
            }
            if (P[1] == 5.0 || P[1] == 6.0) goto label_110;
        }

label_110:
        printf("Sorting %d events\n", in);
        sort(T, in, I);

        for (int i4 = 0; i4 < in; i4++) {
            int i5 = I[i4];
            int i6 = (int)D[i5 + 1];
            if (i6 <= 0 || i6 > NOPC) {
                error(21);
                continue;
            }
            switch (i6) {
                case 7: case 9: error(22); break;
                case 8: case 12: {
                    int i7 = (int)D[i5];
                    int i8 = i5 + 4;
                    int i9 = i5 + i7;
                    int i10 = (int)D[i5 + 3] - i8;
                    for (int i11 = i8; i11 <= i9; i11++) G[i10 + i11] = D[i11];
                    if (i6 == 12) goto label_2;
                    break;
                }
                case 10: {
                    int i13 = (int)D[i5 + 3];
                    IP[2] = i5;
                    if (i13 <= 0 || i13 > 5) {
                        error(23);
                        break;
                    }
                    break;
                }
                default:
label_2:
                    IP[1] = (int)D[i5];
                    int i18 = IP[1];
                    for (int i19 = 1; i19 <= i18; i19++) P[i19] = D[i5 + i19];
                    write2(output_buffer, &output_pos);
                    if (P[1] == 6.0) iend = 1;
                    break;
            }
        }

        if (iend == 0) {
            printf(" END OF SECTION PASS II\n");
            goto label_150;
        }
        printf(" END OF PASS II\n");
    }

cleanup:
    output_buffer[output_pos] = '\0';
    return output_buffer;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
char *run_pass2(char *input, int input_size) {
    return pass2(input, input_size);
}
#endif