function [hist_fer, histp_fer] = hist_varFER(fer, pred, thrL, thrH, y_lim, Pred_ShortName)

fer0 = fer;
pred0 = pred;
Pred_Num = length(thrL);

title_fer = 'Forecast Error Ratio';
title_Xaxis = 'FER Bins [-]';
title_Yaxis = 'Frequencies [-]';
title_pred = [];

for i = 1 : Pred_Num
    
    thrL_temp = thrL(i);
    thrH_temp = thrH(i);
    thrLstr = num2str(thrL_temp);
    thrHstr = num2str(thrH_temp);
                
    temp_pred = pred0(:,i);
    
    fer1 = fer0(temp_pred >= thrL_temp & temp_pred < thrH_temp);
    pred1 = pred0(temp_pred >= thrL_temp & temp_pred < thrH_temp,:);
                
    title_pred =  strcat(title_pred, '(', thrLstr, '<=', Pred_ShortName{i}, '<', thrHstr, ')');
    title_WT = [title_fer, title_pred];
                
    fer0 = fer1;
    pred0 = pred1;
    
end

%Build the hystogram
Xlabel = [' -1.1 to -0.99'
          '-0.99 to -0.75'
          ' -0.75 to -0.5'
          ' -0.5 to -0.25'
          ' -0.25 to 0.25'
          '   0.25 to 0.5'
          '   0.5 to 0.75'
          '     0.75 to 1'
          '      1 to 1.5'
          '      1.5 to 2'
          '        2 to 3'
          '        3 to 5'
          '       5 to 10'
          '      10 to 25'
          '      25 to 50'
          '    50 to 1000'
          '         >1000'];

bin = [-1.1; -0.99; -0.75; -0.5; -0.25; 0.25; 0.5; 0.75; 1; 1.5; 2; 3; 5; 10; 25; 50; 1000];
hist_fer=histc(fer1, bin);
histp_fer=hist_fer/length(fer1);

figure('units','centimeters', 'position', [1,1,25,15])
bar(histp_fer)
title(title_WT)
xlabel(title_Xaxis)
ylabel(title_Yaxis)
xlim([0,(length(bin)+1)])
ylim([0,y_lim])
grid off

n=num2str(hist_fer);
text((1:length(bin)), histp_fer, n, 'rotation', 90, 'FontSize', 11)
set(gca,'XTick', (1:length(bin)))
set(gca,'XTickLabel', Xlabel)
set(gca, 'XTickLabelRotation', 60, 'FontSize', 11)
hold on
set(bar((1:4),histp_fer(1:4)), 'facecolor', 'green');
set(bar((5),histp_fer(5)), 'facecolor', 'white', 'linewidth', 3);
set(bar((6:10),histp_fer(6:10)), 'facecolor', [1,0.84,0]);
set(bar((11:17),histp_fer(11:17)), 'facecolor', 'red');