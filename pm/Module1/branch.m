function [VarPND2Analyse, VarPOR2Analyse, titleBranch] = branch(VarPND, VarPOR, IndP, Predictors)

titleBranch = [];

if IndP==1
    
    disp(newline)
    disp("Top of the decision tree. No branches to select.")
    VarPND2Analyse = VarPND;
    VarPOR2Analyse = VarPOR(:,IndP);
    
else
    
    disp(newline)
    disp("The user should select which branch of the decision tree is going to be analysed.")
    VarB = [VarPND, VarPOR];
    
    for IndB = 2 : (IndP)
        
        disp (newline)
        disp(strcat('Select a branch for predictor n.', num2str(IndB-1), ' -> ', char(string(Predictors(IndB-1)))))
        thrL = input('Select the lower threshold for the branch to analyse, thrL: ');
        thrH = input('Select the upper threshold for the branch to analyse, thrH: ');
        disp(strcat("Selecting ", num2str(thrL), "<=", char(string(Predictors(IndB-1))), "<", num2str(thrH)))
        titleBranch = [titleBranch, strcat(num2str(thrL), "<=", char(string(Predictors(IndB-1))), "<", num2str(thrH))];
        VarB = VarB(VarB(:,IndB) >= thrL & VarB(:,IndB) < thrH,:);
        
    end
    
    VarPND2Analyse = VarB(:,1);
    VarB(:,1) = [];
    VarPOR2Analyse = VarB(:,IndP);
    
end