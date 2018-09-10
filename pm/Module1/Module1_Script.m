%% MODULE 1

% The user does not know anything about the structure of the DT. Therefore,
% the user must follow some procedures to determine the weather types.


%%

close all
clear
clc
disp(newline)
disp('************')
disp('* MODULE 1 *')
disp('************')

disp(newline)
disp('The user does not know anything about the structure of the DT.')
disp('Therefore, the user must follow some procedures to determine the')
disp ('weather types.')

disp(' ')
disp('NOTE: ')
disp('The convention adopted to compute Pred < thr or Pred >= thr is: ')
disp('    Pred < thr => thrL = -9999 ; thrH = thr')
disp('    Pred >= thr => thrL = -thr ; thrH = 9999')
disp(' ')

% Inputs from the user
NumOfBins = 100; % The analised variable will be divided into "NumOfBins" cathegories
NumOfMem = 100; % This is the number of new members that the user wants to create in the "Ensemble of Ensembles"

% Load the data
load InputData_Test.mat
Vars2Test = {"CPR"; "TP"; "WSPD700"; "CAPE"; "SR24h"};
pointer = find(CPR<0 | CPR>1);
FER(pointer) = [];
CPR(pointer) = [];
r = (rand(1,length(CPR))/1000)';
CPR = CPR + r;


%% Start the post-processing

m = length(Vars2Test);


k = 1;
eval(['Var', strcat('=', char(string(Vars2Test(k))), ';')])
MinVar = min(Var);
MaxVar = max(Var);
disp(char(string(Vars2Test(k))))
disp(strcat('Minimum value=', char(string(MinVar))))
disp(strcat('Maximum value=', char(string(MaxVar))))


% Split the data in samples to analise
EstNumElem = (10 * (100 / NumOfMem)) * NumOfMem; %the software suggests 10 values for each new member in the mapping functions

if EstNumElem < (length(Var))
    
    NumElem = round(length(Var)/NumOfBins);
    
    if NumElem < EstNumElem
        
        disp(strcat('Suggested number of elements for each sample in the analisys by ecPoint-Cal:', num2str(EstNumElem)))
        disp(strcat('Number of bins suggested by the user:', num2str(NumOfBins)))
        disp(strcat('Number of elements for each sample in the analisys due to the selected number of bins:', num2str(NumElem)))
        disp('The selected number of bins is too big. It generates samples that contain less than the minimum number suggested for each sample.')
        NumOfBins = input('Please, choose a smaller number of bins:');
        NumElem = round(length(Var)/NumOfBins);
        
        while NumElem < EstNumElem
            disp(strcat('Suggested number of elements for each sample in the analisys by ecPoint-Cal:', num2str(EstNumElem)))
            disp(strcat('Number of bins suggested by the user:', num2str(NumOfBins)))
            disp(strcat('Number of elements for each sample in the analisys due to the selected number of bins:', num2str(NumElem)))
            disp('The selected number of bins is too big. It generates samples that contain less than the minimum number suggested for each sample.')
            NumOfBins = input('Please, choose a smaller number of bins:');
            NumElem = round(length(Var)/NumOfBins);
        end
        
    end
    
else
    
    disp('The number of elements in the variable to analise are too little. No plits should be applied.')
    return

end


% Display some information on the screen
disp(strcat('Suggested number of elements for each sample in the analisys by ecPoint-Cal:', num2str(EstNumElem)))
disp(strcat('Number of bins suggested by the user:', num2str(NumOfBins)))
disp(strcat('Number of elements for each sample in the analisys due to the selected number of bins:', num2str(NumElem)))
        
[VarSort, Ind] = sort(Var);
VarSort = round(VarSort,4);
FERSort = FER(Ind);
Position = (1:length(VarSort))';

Pos = (1:NumElem:length(VarSort))';
Pos = [Pos; length(VarSort)]; % Position of the values in which the sample will be splitted


% Display the breakpoints suggested by ecPoint-Cal
pos1 = Pos(1);
pos2 = Pos(2);
pos3 = Pos(3);
Sample1 = FERSort(Position>=pos1 & Position<pos2);
Sample2 = FERSort(Position>=pos2 & Position<pos3);

count = 1;
BreakPoints = [min(VarSort)];

while pos2 <= (Pos(end-2))

    h = kstest2(Sample1,Sample2, 'Alpha', 0.01);
    
    if h == 1 
        
        thr1 = VarSort(pos1);
        thr2 = VarSort(pos2);
        thr3 = VarSort(pos3);
        
        disp(strcat('Suggested breakpoint n.', num2str(count), ':', num2str(thr2)))
        bin = [-1.1; -0.99; -0.75; -0.5; -0.25; 0.25; 0.5; 0.75; 1; 1.5; 2; 3; 5; 10; 25; 50; 1000];
        hist_var(Sample1, Sample2, bin, 1, thr1, thr2, thr3);
        
        count = count + 1;
        
        pos1 = pos2;
        pos2 = pos3;
        pos3 = Pos(find(Pos == pos3) + 1);
        
        BreakPoints = [BreakPoints; thr2];
        
    else
        
        pos2 = pos3;
        pos3 = Pos(find(Pos == pos3) + 1);
        
    end
    
    Sample1 = FERSort(Position>=pos1 & Position<pos2);
    Sample2 = FERSort(Position>=pos2 & Position<pos3);
    
end

BreakPoints = [BreakPoints; max(VarSort)];
n = length(BreakPoints);


% Differences in the shape of the distribution
% Parameters introduced by the user
Thr = [0; 0.25; 0.5; 0.75; 1];
thr_0 = [5;10;1;1];
thr_over = [5;10;1;1];
thr_1 = [5;10;1;1];
thr_under = [1;1;1;1];
thr_tail = [0;0;0;0];

m = length(Thr) - 1;
bin = [-1.1; -0.99; -0.75; -0.5; -0.25; 0.25; 0.5; 0.75; 1; 1.5; 2; 3; 5; 10; 25; 50; 1000];
DefBreakPoints = BreakPoints(1);

i = 1;
thr1 = BreakPoints(i);
thr2 = BreakPoints(i+1);
thr3 = BreakPoints(i+2);

count = 1;

while i <= n-2
    
    Sample1 = FER(Var>=thr1 & Var<thr2);
    Sample2 = FER(Var>=thr2 & Var<thr3);
    
    [histp1, histp2] = hist_var(Sample1, Sample2, bin, 0, thr1, thr2, thr3);
    
    hist1_0 = histp1(1);
    hist1_over = histp1(1) + histp1(2) + histp1(3) + histp1(4);
    hist1_1 = histp1(5);
    hist1_under = histp1(6) + histp1(7) + histp1(8) + histp1(9) + histp1(10) + histp1(11) + histp1(12) + histp1(13) + histp1(14) + histp1(15) + histp1(16) + histp1(17);
    hist1_tail = histp1(11) + histp1(12) + histp1(13) + histp1(14) + histp1(15) + histp1(16) + histp1(17);
    
    hist2_0 = histp2(1);
    hist2_over = histp2(1) + histp2(2) + histp2(3) + histp2(4);
    hist2_1 = histp2(5);
    hist2_under = histp2(6) + histp2(7) + histp2(8) + histp2(9) + histp2(10) + histp2(11) + histp2(12) + histp2(13) + histp2(14) + histp2(15) + histp2(16) + histp2(17);
    hist2_tail = histp2(11) + histp2(12) + histp2(13) + histp2(14) + histp2(15) + histp2(16) + histp2(17);
    
    hist_0 = abs(hist1_0-hist2_0);
    hist_over = abs(hist1_over-hist2_over);
    hist_1 = abs(hist1_1-hist2_1);
    hist_under = abs(hist1_under-hist2_under);
    hist_tail = abs(hist1_tail-hist2_tail);
    
    for j = 1 : m-1
        
        if ( thr2 > Thr(j) && thr2 < Thr(j+1) )
            
            if hist_0>=thr_0(j) && hist_over>=thr_over(j) && hist_1>=thr_1(j) && hist_under>=thr_tail(j) && hist_tail>=thr_tail(j)
                
                disp(strcat('Suggested breakpoint n.', num2str(count), ':', num2str(thr2)))
                DefBreakPoints = [DefBreakPoints; thr2];
                
                thr1 = thr2;
                thr2 = thr3;
                thr3 = BreakPoints(i+2);
                
                count = count + 1;
                
            else
                
                thr2 = thr3;
                thr3 = BreakPoints(i+2);
                
            end
            
        end
                
    end
    
    i = i + 1;
    
end
DefBreakPoints = [DefBreakPoints; BreakPoints(end)];

% Displaying the final Mapping Functions
close all
bin = [-1.1; -0.99; -0.75; -0.5; -0.25; 0.25; 0.5; 0.75; 1; 1.5; 2; 3; 5; 10; 25; 50; 1000];
for i = 1 : length(DefBreakPoints)-1
    thr1 = DefBreakPoints(i);
    thr2 = DefBreakPoints(i+1);
    [hist_fer, histp_fer] = hist_varFER(FER, Var, thr1, thr2, 1, "CPR");
end

ThrL = [0;0.25;0.5;075];
ThrH = [0.25;0.5;0.75;1];