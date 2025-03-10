#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

float P[100] = {0};
int IP[10] = {0};
float D[2000] = {0};

#define NOPS 27
#define NBC 3
#define NC 72
static char IDEC = '.', ISTAR = '*';
static char IBC[4] = {';', ' ', ',', '-'};
static char IVT[4] = {'P', 'F', 'B', 'V'};
static char LOP[81] = {
    'N','O','T','I','N','S','G','E','N','S','V','3',
    'S','E','C','T','E','R','S','V','1','S','V','2',
    'P','L','F','P','L','S','S','I','3','S','I','A',
    'C','O','M','E','N','D','O','U','T','O','S','C',
    'A','D','2','R','A','N','E','N','V','S','T','R',
    'A','D','3','A','D','4','M','L','T','F','L','T',
    'R','A','H','S','E','T','I','O','S'
};

static char IBCD[300] = {0};
static char CARD[129] = {0};

int ipdp = 0, idef = 0, i100 = 1, pflflag = 0;
float END = 0.0, SNA8 = 0.0, STER = 0.0;
float XN = 0.0;

int char_to_int(char ch) {
    return (int)(ch - '0');
}

char *pass1(char *input_buffer, int input_size) {
    char *output_buffer = (char *)malloc(4096); // Larger buffer to be safe
    if (!output_buffer) {
        printf("Failed to allocate output buffer\n");
        return NULL;
    }
    int output_pos = 0;

    int input_pos = 0;
    int line_len = 0;
    int I = 0, IBK = 2;
    float ERR = 0.0;
    int NUMU = 0, ISEMI = 1, L = 3, J = 0;
    int N = 0, NP = 0, I1 = 0, I2 = 0, I3 = 0, I4 = 0, I6 = 0, M = 0;
    int NPW = 0;
    float NNC = 0.0, NN = 0.0, TTS = 0.0, TFACT = 0.0, TDD = 0.0;
    int NI = 0, NJ = 0;
    float TF = 0.0, AINST = 0.0;
    float SGN = 0.0;
    int L1 = 0, LD = 0;
    int LL = 0, IEX = 0, LA = 0, LB = 0;
    char IGAD = 0;
    int IX1 = 0;

    D[3] = 44100.0;
    IP[1] = 0;
    P[1] = 0.0;

label_4321:
    if (ipdp == 0) goto label_9999;
    if ((END + SNA8 - 1.0) > 0.0) goto label_90;

label_10:
    IBK = 2;
    END = 0.0;
    ERR = 0.0;
    NUMU = 0;
    ISEMI = 1;
    L = 3;
    J = 0;

label_11:
    I++;
    if (I > NC) goto label_15;
    if (J == 299) goto label_21;
    for (N = 0; N < NBC; N++) {
        if (CARD[I - 1] != IBC[N]) continue;
        switch (N) {
            case 0: goto label_20;
            case 1: goto label_16;
            case 2: goto label_18;
        }
    }
    J++;
    IBCD[J - 1] = CARD[I - 1];
    IBK = 1;
    goto label_11;

label_14:
    IBK = N;
    goto label_11;

label_15:
    if (input_pos >= input_size) goto label_95;
    line_len = 0;
    while (input_pos < input_size && line_len < NC && input_buffer[input_pos] != '\n') {
        CARD[line_len++] = input_buffer[input_pos++];
    }
    if (input_pos < input_size && input_buffer[input_pos] == '\n') input_pos++;
    while (line_len < NC) CARD[line_len++] = ' ';
    printf(" %128.*s\n", NC, CARD);
    I = 0;
    goto label_11;

label_16:
    switch (IBK) {
        case 1: goto label_17;
        case 2: case 3: goto label_11;
    }

label_17:
    IBK = N;
    J++;
    IBCD[J - 1] = IBC[1];
    if (ISEMI == 1) goto label_11;
    goto label_21;

label_18:
    switch (IBK) {
        case 1: goto label_17;
        case 2: goto label_14;
        case 3: goto label_19;
    }

label_19:
    J++;
    IBCD[J - 1] = '\0';
    goto label_17;

label_20:
    ISEMI = 2;
    switch (IBK) {
        case 1: goto label_17;
        case 2: goto label_21;
        case 3: goto label_19;
    }

label_21:
    J++;
    IBCD[J - 1] = IBC[0];
    M = 0;
    for (int n = 1; n <= NOPS; n++) {
        M = n;
        for (int K = 0; K < 3; K++) {
            if (IBCD[K] != LOP[(n - 1) * 3 + K]) goto label_24;
        }
        goto label_26;
label_24:
        continue;
    }
    goto label_40;

label_26:
    NP = 1;

label_27:
    L++;
    if (IBCD[L - 1] != IBC[1]) goto label_27;

label_29:
    printf("Processing opcode %d\n", M);
    switch (M) {
        case 1: goto label_9100;
        case 2: goto label_9200;
        case 3: goto label_300;
        case 4: goto label_400;
        case 5: goto label_500;
        case 6: goto label_600;
        case 7: goto label_700;
        case 8: goto label_800;
        case 9: goto label_900;
        case 10: goto label_1000;
        case 11: goto label_1100;
        case 12: goto label_1200;
        case 13: goto label_1300;
        case 14: goto label_217;
        case 15: goto label_9201;
        case 16: goto label_202;
        case 17: goto label_203;
        case 18: goto label_204;
        case 19: goto label_205;
        case 20: goto label_206;
        case 21: goto label_207;
        case 22: goto label_208;
        case 23: goto label_209;
        case 24: goto label_210;
        case 25: goto label_211;
        case 26: goto label_212;
        case 27: goto label_213;
    }

label_9100:
    P[0] = 1.0;
    goto label_30;

label_9200:
    P[0] = 2.0;
    idef = 1;
    N = 1;
    goto label_70;

label_2000:
    P[1] = XN;
    N = 2;
    goto label_70;

label_2001:
    P[2] = XN;
    IP[0] = 3;
    goto label_50;

label_9201:
    P[2] = 101.0;
    NPW = 2;
    if (STER <= 0) goto label_220;
    SNA8 = 1.0;
    STER = 0;
    goto label_220;

label_202:
    P[2] = 102.0;
    NPW = 5;
    goto label_220;

label_203:
    P[2] = 103.0;
    NPW = 3;
    goto label_220;

label_204:
    P[2] = 104.0;
    NPW = 6;
    goto label_220;

label_205:
    P[2] = 105.0;
    NPW = 7;
    goto label_220;

label_206:
    P[2] = 106.0;
    NPW = 3;
    if (STER != 0) goto label_220;
    SNA8 = 1.0;
    STER = 1;
    goto label_220;

label_207:
    P[2] = 107.0;
    NPW = 4;
    goto label_220;

label_208:
    P[2] = 108.0;
    NPW = 5;
    goto label_220;

label_209:
    P[2] = 109.0;
    NPW = 3;
    goto label_220;

label_210:
    P[2] = 112.0;
    NPW = 4;
    goto label_220;

label_211:
    P[2] = 111.0;
    NPW = 5;
    goto label_220;

label_213:
    P[2] = 113.0;
    NPW = 5;
    goto label_220;

label_212:
    P[2] = 110.0;
    NPW = 1;
    goto label_220;

label_217:
    IP[0] = 2;
    idef = 0;
    END = 1.0;
    goto label_50;

label_218:
    N = 8;
    NUMU = 1;
    L = 0;
    goto label_70;

label_219:
    M = (int)XN + 14;
    if (XN < 11.0) goto label_29;
    P[2] = XN;

label_220:
    NP = 3;

label_221:
    if (IBCD[L] == IBC[0]) goto label_240;
    NP++;
    L++;
    for (N = 0; N < 4; N++) {
        if (IBCD[L - 1] == IVT[N]) goto label_225;
    }

label_224:
    L++;
    if (IBCD[L - 1] == IBC[1]) goto label_46;
    goto label_224;

label_225:
    switch (N) {
        case 0: goto label_231;
        case 1: goto label_232;
        case 2: goto label_233;
        case 3: goto label_234;
    }

label_231:
    N = 3;
    goto label_70;

label_2311:
    P[NP - 1] = XN;
    goto label_221;

label_232:
    N = 4;
    goto label_70;

label_2321:
    P[NP - 1] = -(XN + 100.0);
    goto label_221;

label_233:
    N = 5;
    goto label_70;

label_2331:
    P[NP - 1] = -XN;
    goto label_221;

label_234:
    N = 6;
    goto label_70;

label_2341:
    P[NP - 1] = XN + 100.0;
    goto label_221;

label_240:
    if (NUMU == 1) goto label_242;
    if (NPW + 3 - NP != 0) goto label_42;

label_242:
    IP[0] = NP;
    goto label_50;

label_300:
    P[0] = 3.0;
    goto label_30;

label_400:
    P[0] = 4.0;
    goto label_30;

label_500:
    P[0] = 5.0;
    goto label_30;

label_600:
    P[0] = 6.0;
    goto label_30;

label_700:
    P[0] = 7.0;
    goto label_30;

label_800:
    P[0] = 8.0;
    goto label_30;

label_900:
    P[0] = 9.0;
    goto label_30;

label_1000:
    P[0] = 10.0;
    goto label_30;

label_1100:
    P[0] = 11.0;
    goto label_30;

label_1200:
    P[0] = 12.0;
    goto label_30;

label_1300:
    if (IBCD[L - 1] != IBC[0]) goto label_1301;
    L++;
    goto label_4321;

label_1301:
    L++;
    goto label_1300;

label_30:
    if (idef > 0) goto label_43;

label_32:
    if (IBCD[L] == IBC[0]) goto label_34;
    NP++;
    N = 7;
    goto label_70;

label_331:
    P[NP - 1] = XN;
    goto label_32;

label_34:
    IP[0] = NP;
    if (NP - 1 > 0) goto label_50;
    goto label_47;

label_40:
    if (idef > 0) goto label_218;

label_41:
    L++;
    if (IBCD[L - 1] != IBC[0]) goto label_41;
    printf("    OP CODE NOT UNDERSTOOD\n");
    goto label_49;

label_42:
    printf("    UNIT CONTAINS WRONG NUMBER OF PARAMETERS\n");
    goto label_49;

label_43:
    printf("    INSTRUMENT DEFINITION INCOMPLETE\n");
    ERR = 1.0;
    idef = 0;
    goto label_32;

label_44:
    printf("    ERROR IN NUMERIC DATA\n");
    ERR = 1.0;
    if (NUMU == 1) goto label_45;
    goto label_30;

label_45:
    printf("                          FOR UNIT DESIGNATION\n");
    P[2] = 0.0;
    goto label_220;

label_46:
    printf("    IMPROPER VARIABLE IN UNIT DEFINITION\n");
    ERR = 1.0;
    goto label_221;

label_47:
    printf("    STATEMENT INCOMPLETE\n");

label_49:
    IP[1] = 1;
    goto label_10;

label_50:
    if (ERR == 1.0) goto label_49;
    printf("P array: ");
    for (int i = 0; i < NP; i++) printf("%f ", P[i]);
    printf("\n");

label_4322:
    I1 = (int)P[0];
    printf("I1 = %d\n", I1);
    if (I1 >= 1 && I1 <= 12) goto label_103;
    IP[1] = 1;
    printf(" NON-EXISTENT OPCODE ON DATA STATEMENT\n");
    goto label_100;

label_103:
    switch (pflflag) {
        case 1: goto label_9919;
        case 2: goto label_9929;
        case 3: goto label_9939;
        case 4: goto label_9949;
        case 5: goto label_9959;
        default: break;
    }
    switch (I1) {
        case 1: case 2: case 3: case 4: goto label_1010;
        case 5: goto label_5;
        case 6: goto label_6;
        case 7: goto label_7;
        case 8: goto label_1010;
        case 9: goto label_9;
        case 10: case 11: goto label_1010;
        case 12: goto label_12;
    }

label_1010:
    printf("Writing at 1010: IP[0] = %d\n", IP[0]);
    {
        int K = IP[0];
        char temp[256];
        int len = snprintf(temp, sizeof(temp), "%d", K);
        for (int J = 0; J < K; J++) {
            len += snprintf(temp + len, sizeof(temp) - len, " %f", P[J]);
        }
        printf("Output line: %s\n", temp);
        if (output_pos + len + 1 < 4096) {
            memcpy(output_buffer + output_pos, temp, len);
            output_buffer[output_pos + len] = '\n';
            output_pos += len + 1;
        } else {
            printf("Buffer overflow prevented at pos %d\n", output_pos);
        }
    }
    goto label_100;

label_5:
    printf(" END OF SECTION IN PASS I\n");
    goto label_1010;

label_6:
    printf(" END OF PASS I\n");
    if (IP[1] == 1) {
        printf(" WHERE IS HARVEY\n");
        free(output_buffer);
        return NULL;
    }
    {
        int K = IP[0];
        char temp[256];
        int len = snprintf(temp, sizeof(temp), "%d", K);
        for (int J = 0; J < K; J++) {
            len += snprintf(temp + len, sizeof(temp) - len, " %f", P[J]);
        }
        printf("Output line (TER): %s\n", temp);
        if (output_pos + len + 1 < 4096) {
            memcpy(output_buffer + output_pos, temp, len);
            output_buffer[output_pos + len] = '\n';
            output_pos += len + 1;
        }
    }
    output_buffer[output_pos] = '\0'; // Null-terminate
    return output_buffer;

label_7:
    I2 = (int)P[2];
    I3 = I2 + IP[0] - 4;
    for (I4 = I2; I4 <= I3; I4++) {
        D[13] = P[14 - I2 + 3];
    }
    goto label_100;

label_9:
    I6 = (int)P[2];
    if (I6 >= 1 && I6 <= 5) goto label_107;
    IP[1] = 1;
    printf(" NON-EXISTENT PLF SUBROUTINE CALLED\n");
    goto label_100;

label_12:
    goto label_7;

label_107:
    pflflag = I6;
    switch (I6) {
        case 1: goto label_9921;
        case 2: goto label_9922;
        case 3: goto label_9923;
        case 4: goto label_9924;
        case 5: goto label_9925;
    }

label_9921:
label_9919:
    pflflag = 0;
    goto label_100;

label_9922:
label_9929:
    pflflag = 0;
    goto label_100;

label_9923:
    NNC = P[3];
    NN = P[4];
    TTS = P[5];
    TFACT = P[6];
    TDD = P[7];
    NI = 1;

label_9930:
    goto label_4321;

label_9939:
    {
        int K = IP[0];
        char temp[256];
        int len = snprintf(temp, sizeof(temp), "%d", K);
        for (int J = 0; J < K; J++) {
            len += snprintf(temp + len, sizeof(temp) - len, " %f", P[J]);
        }
        if (output_pos + len + 1 < 4096) {
            memcpy(output_buffer + output_pos, temp, len);
            output_buffer[output_pos + len] = '\n';
            output_pos += len + 1;
        }
    }
    TF = P[5];
    for (NJ = 1; NJ <= NN; NJ++) {
        P[5] = (float)(NJ + 1) * TF;
        P[1] = P[1] + TTS;
        AINST = P[2] - 1;
        if (AINST == 0) goto label_9934;

label_9933:
        P[2] = 2.0;
        goto label_9935;

label_9934:
        P[1] = 1.0;

label_9935:
        if (TFACT > 0) P[4] = P[4] * TFACT;
        {
            int K = IP[0];
            char temp[256];
            int len = snprintf(temp, sizeof(temp), "%d", K);
            for (int J = 0; J < K; J++) {
                len += snprintf(temp + len, sizeof(temp) - len, " %f", P[J]);
            }
            if (output_pos + len + 1 < 4096) {
                memcpy(output_buffer + output_pos, temp, len);
                output_buffer[output_pos + len] = '\n';
                output_pos += len + 1;
            }
        }
    }
    NI++;
    if (NI > NNC) goto label_9931;
    goto label_9930;

label_9931:
    pflflag = 0;
    goto label_100;

label_9924:
label_9949:
    pflflag = 0;
    goto label_100;

label_9925:
label_9959:
    pflflag = 0;
    goto label_100;

label_70:
    SGN = 1.0;
    if (IBCD[L] != IBC[3]) goto label_79;
    SGN = -1.0;
    L++;

label_79:
    L1 = L + 1;
    LD = L1;
    XN = 0.0;

label_71:
    L++;
    if (IBCD[L - 1] == IBC[1]) goto label_77;
    if (IBCD[L - 1] < 10) goto label_71;
    if (IBCD[L - 1] == IDEC) goto label_71;
    if (IBCD[L - 1] == ISTAR) goto label_77;

label_76:
    goto label_71;

label_77:
    if (IBCD[L1 - 1] != ISTAR) goto label_80;
    XN = P[NP - 1];
    goto label_89;

label_80:
    for (LL = L1; LL <= L; LL++) {
        LD = LL;
        if (IBCD[LL - 1] == IDEC) goto label_82;
    }

label_82:
    IEX = 0;
    LA = L1;
    LB = LD - 1;
    if (LD - L1 <= 0) goto label_86;
    IEX = LD - LA;

label_84:
    for (LL = LA; LL <= LB; LL++) {
        IEX--;
        IGAD = IBCD[LL - 1];
        IX1 = char_to_int(IGAD);
        XN += IX1 * powf(10.0, IEX);
    }

label_86:
    if (L - LB - 2 <= 0) goto label_88;
    LA = LD + 1;
    LB = L - 1;
    goto label_84;

label_88:
    XN *= SGN;
    printf("Parsed XN = %f\n", XN);

label_89:
    switch (N) {
        case 1: goto label_2000;
        case 2: goto label_2001;
        case 3: goto label_2311;
        case 4: goto label_2321;
        case 5: goto label_2331;
        case 6: goto label_2341;
        case 7: goto label_331;
        case 8: goto label_219;
    }

label_90:
    P[0] = 12.0;
    P[2] = 8.0;
    P[3] = STER;
    IP[0] = 4;
    END = 0.0;
    SNA8 = 0.0;
    goto label_50;

label_95:
    NP = 2;
    IP[1] = 1;
    L = 0;
    IBCD[0] = IBC[0];
    goto label_600;

label_9999:
    if (input_pos >= input_size) goto label_95;
    line_len = 0;
    while (input_pos < input_size && line_len < NC && input_buffer[input_pos] != '\n') {
        CARD[line_len++] = input_buffer[input_pos++];
    }
    if (input_pos < input_size && input_buffer[input_pos] == '\n') input_pos++;
    while (line_len < NC) CARD[line_len++] = ' ';
    printf(" %128.*s\n", NC, CARD);
    ipdp = 1;
    I = 0;
    idef = 0;
    IBK = 2;
    STER = 0.0;
    END = 0.0;
    SNA8 = 0.0;
    if (i100 == 0) goto label_4322;
    i100 = 0;

label_100:
    goto label_4321;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
char *run_pass1(char *input, int input_size) {
    return pass1(input, input_size);
}
#endif

int main() {
    char input[] = "INS 0 1 ;\nOSC P5 P6 B2 F2 P30;\nOUT B2 B1;\nEND;\n"
                   "GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;\n"
                   "NOT 0 1 .50 125 8.45;\nTER 8.00 ;\n";
    char *output = pass1(input, strlen(input));
    if (output) {
        printf("Output:\n%s", output);
        free(output);
    }
    return 0;
}