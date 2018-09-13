function [UserBP] = CustomBP(VarPND2Analyse, VarPOR2Analyse, IndP, Predictors, TypeOfPredictand)

NumUserBP = input('Number of breakpoints that the user wants to keep from the suggested set: ');
UserBP = zeros(NumUserBP+2,1);
UserBP(1) = -Inf;
UserBP(end) = Inf;

for i = 2 :  NumUserBP+1
    UserBP(i) = input(strcat('Enter threshold no.', num2str(i-1), ': '));
end

for j = 1 : length(UserBP)-1
    thr1 = UserBP(j);
    thr2 = UserBP(j+1);
    if strcmp(TypeOfPredictand,"Forecast Error Ratio")
        hist_varFER(VarPND2Analyse, VarPOR2Analyse, thr1, thr2, 1, Predictors(IndP));
    elseif strcmp(TypeOfPredictand,"Forecast Error")
        %Not implemented
    end
end

disp(newline)
disp('Do you want to test a different set of breakpoints?')
a = input('Select 1 to test a different set of breakpoints, select 0 otherwise: ');

while a == 1
    
    NumUserBP = input('Number of breakpoints to test: ');
    UserBP = zeros(NumUserBP+2,1);
    UserBP(1) = -Inf;
    UserBP(end) = Inf;
    
    for i = 2 :  NumUserBP+1
        UserBP(i) = input(strcat('Enter threshold no.', num2str(i-1), ': '));
    end
    
    for j = 1 : length(UserBP)-1
        thr1 = UserBP(j);
        thr2 = UserBP(j+1);
        if strcmp(TypeOfPredictand,"Forecast Error Ratio")
            hist_varFER(VarPND2Analyse, VarPOR2Analyse, thr1, thr2, 1, "CPR");
        elseif strcmp(TypeOfPredictand,"Forecast Error")
            %Not implemented
        end
    end
    
    disp(newline)
    disp('Do you want to test a different set of breakpoints?')
    a = input('Select 1 to test a different set of breakpoints, select 0 otherwise: ');
    
end