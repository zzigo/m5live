#!/bin/sh
rm snd.raw
cp -f $1 score
./pass1
./pass2
./pass3
mv snd.raw $2
echo "===================="
echo $2 "has been written to disk"
echo "===================="

sox -r 44100 -e floating-point -b 32 -c 1 -t raw $2 $2.wav 

echo "===================="
echo $2.wav "has been converted"
echo "===================="
