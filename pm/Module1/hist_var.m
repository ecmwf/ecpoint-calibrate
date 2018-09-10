function [histp1, histp2] = hist_var(sample1, sample2, bin, plotVar, thr1, thr2, thr3)

hist1 = histc(sample1, bin);
hist2 = histc(sample2, bin);

histp1=hist1/length(sample1) * 100;
histp2=hist2/length(sample2) * 100;

if plotVar ==1
    
    figure('units','centimeters', 'position', [1,1,25,25])
    
    %Plot for Sample1
    subplot(2,1,1)
    bar(histp1)
    title(strcat(string(thr1), '<=Sample1<', string(thr2)))
    xlabel('FER [-]')
    ylabel('Frequencies')
    grid on
    n=num2str(hist1);
    n1=num2str(bin);
    text((1:length(bin)), histp1, n, 'horizontalalignment','center','verticalalignment','bottom')
    set(gca,'XTick', (1:length(bin)))
    set(gca,'XTickLabel', n1)
    ylim([0,100])
    
    %Plot for Sample2
    subplot(2,1,2)
    bar(histp2)
    title(strcat(string(thr2), '<=Sample2<', string(thr3)))
    xlabel('FER [-]')
    ylabel('Frequencies')
    grid on
    n=num2str(hist2);
    n1=num2str(bin);
    text((1:length(bin)), histp2, n, 'horizontalalignment','center','verticalalignment','bottom')
    set(gca,'XTick', (1:length(bin)))
    set(gca,'XTickLabel', n1)
    ylim([0,100])
    
end














