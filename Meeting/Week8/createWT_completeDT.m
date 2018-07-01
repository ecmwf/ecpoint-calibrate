function [thrL_matrix, thrH_matrix] = createWT_completeDT(thrL, thrH)

% Count the number of Weather Types to compute
[~,Pred_Num] = size(thrL);
thr_Num = zeros(1,Pred_Num);
thr_Acc = zeros(1,Pred_Num);
thr_AccStart = 1;

for i = 1:Pred_Num
    temp = thrL(:,i);
    temp(isnan(temp)) = [];
    thr_Num(1,i) = length(temp);
    thr_AccStart = thr_AccStart * length(temp);
    thr_Acc(1,i) = thr_AccStart;
end
WT_Num = thr_Acc(end);


% Create the Weather Types
thrL_matrix = zeros(WT_Num, Pred_Num);
thrH_matrix = zeros(WT_Num, Pred_Num);

% last column
tempL = thrL(:,end);
tempH = thrH(:,end);
tempL(isnan(tempL)) = [];
tempH(isnan(tempH)) = [];
m = length(tempL);
for i = 1:m:WT_Num
    ind_i = i;
    ind_f = ind_i + m - 1;
    thrL_matrix(ind_i:ind_f,end) = tempL;
    thrH_matrix(ind_i:ind_f,end) = tempH;
end

% All left columns
rep = 1;
for i = (Pred_Num-1):-1:1
    
    tempL1 = thrL(:,i);
    tempH1 = thrH(:,i);
    tempL1(isnan(tempL1)) = [];
    tempH1(isnan(tempH1)) = [];
    m = length(tempL1);
    rep = rep * thr_Num(i+1);
    counter = 1;
    
    if i == 1
        
        for j = 1:thr_Acc(1)
            
            for k = 1:m
            
                ind_i = counter;
                ind_f = counter + rep - 1;
                tempL2 = tempL1(k);
                tempH2 = tempH1(k);
                thrL_matrix(ind_i:ind_f,i) = tempL2;
                thrH_matrix(ind_i:ind_f,i) = tempH2;
                counter = ind_f + 1;
                
            end
        
        end
        
    else
        
        for j = 1:thr_Acc(1,i-1)
            
            for k = 1:m
                
                ind_i = counter;
                ind_f = counter + rep - 1;
                tempL2 = tempL1(k);
                tempH2 = tempH1(k);
                thrL_matrix(ind_i:ind_f,i) = tempL2;
                thrH_matrix(ind_i:ind_f,i) = tempH2;
                counter = ind_f + 1;
                
            end
        
        end
        
    end
    
end