function [BreakPoints] = DefBP(SortPND, SortPOR, PosAll, PosBP, TypeOfPredictand, bin)

pos1 = PosBP(1);
pos2 = PosBP(2);
pos3 = PosBP(3);
SubS1 = SortPND(PosAll>=pos1 & PosAll<pos2);
SubS2 = SortPND(PosAll>=pos2 & PosAll<pos3);

count = 1;
BreakPoints = [];

disp(newline)
while pos3 <= PosBP(end-1)

    h = kstest2(SubS1,SubS2, 'Alpha', 0.01); % Kolmogorov-Smirnov test with 99% of significance level
    
    if h == 1 % The test rejects the null hypothesis 
        
        thr1 = SortPOR(pos1);
        thr2 = SortPOR(pos2);
        thr3 = SortPOR(pos3);
        
        
        disp(strcat('Suggested breakpoint n.', num2str(count), ':', num2str(thr2)))
        
        if strcmp(TypeOfPredictand,"Forecast Error Ratio")
            hist_var(SubS1, SubS2, bin, thr1, thr2, thr3);
        elseif strcmp(TypeOfPredictand,"Forecast Error")
            %Not implemented
        end
        
        count = count + 1;
        
        pos1 = pos2;
        pos2 = pos3;
        pos3 = PosBP(find(PosBP == pos3) + 1);
        
        BreakPoints = [BreakPoints; thr2];
        
    else % The test does not reject the null hypothesis 
        
        pos2 = pos3;
        pos3 = PosBP(find(PosBP == pos3) + 1);
        
    end
    
    SubS1 = SortPND(PosAll>=pos1 & PosAll<pos2);
    SubS2 = SortPND(PosAll>=pos2 & PosAll<pos3);
    
end

BreakPoints = [-Inf; BreakPoints; Inf];
