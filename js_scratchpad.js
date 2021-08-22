window.maxAndMinValueByColumnKey =
{
   avgTaxableIncomePerPersonInPostcode  : {max: 201926, min: 32176},
   percentInEducationBachelorEnrolled   : {max:     94, min:     0},
   percentInEducationDeferred           : {max:     47, min:     0},
   percentInEducationTafeOrVetEnrolled  : {max:     50, min:     0},
   percentInEducationApprenticeOrTrainee: {max:     28, min:     0},
   percentNotInEducationEmployed        : {max:     50, min:     0},
   percentNotInEducationLookingForWork  : {max:     30, min:     0},
   percentNotInEducationOther           : {max:     10, min:     0}
};

window.maxAndMinValueByColumnKey =
{
   avgTaxableIncomePerTaxpayer           : {max: 445904, min: -9778},
   avgSalaryOrWagesPerTaxpayer           : {max: 102783, min: 11301},
//   avgNonSalaryOrWagesPerTaxpayer        : {max: , min: },
   avgHelpDebtDollarsPerTaxpayer         : {max:    812, min:     0},
   avgGovAllowancesAndPaymentsPerTaxpayer: {max:   3906, min:     0},
   avgGovPensionsAndAllowancesPerTaxpayer: {max:   2851, min:     0},
   avgSuperIncomePerTaxpayer             : {max:   9656, min:     0},
   avgGiftsOrDonationsPerTaxpayer        : {max: 103305, min:     3},
   avgTotalDeductionsPerTaxpayer         : {max: 109377, min:   246}
};

$(document).ready
(
   function ()
   {
      _setBackgroundColorsForColumnsWithMinAndMaxValues();
   }
);

function _setBackgroundColorsForColumnsWithMinAndMaxValues()
{
   boolAddColorKey = false;

   for (var columnKey in window.maxAndMinValueByColumnKey)
   {
      var minAndMax   = window.maxAndMinValueByColumnKey[columnKey];

      var thsJq       = $('table.editable-table > thead > tr > th');
      var columnIndex = 0;

      for (var i = 0; i < thsJq.length; ++i)
      {
         if ($(thsJq[i]).attr('data-column-key') == columnKey)
         {
            columnIndex = i + 1;
            break;
         }
      }

      boolAddColorKey = true;

      if (columnIndex === null)
      {
         return;
      }

      var tdsJq = $('table.editable-table > tbody > tr > td:nth-child(' + columnIndex + ')');

      for (var i = 0; i < tdsJq.length; ++i)
      {
         var tdJq  = $(tdsJq[i]);
         var tdVal = tdJq.find('div.value-div').html().replace('$', '').replace(',', '');

         tdJq.css('backgroundColor', _getCssColorForRangeValue(minAndMax.min, tdVal, minAndMax.max));
      }
   }

   if (boolAddColorKey)
   {
      _addColorKeyDiv();
   }
}

function _getCssColorForRangeValue(rangeMin, value, rangeMax)
{
   var midpoint = rangeMin + ((rangeMax - rangeMin) / 2);

   // Color scheme from https://www.schemecolor.com/hot-and-cold.php.
   var initialR = 255; var initialG = 221; var initialB =  62; // (yellow).
   var finalR   =  86; var finalG   = 171; var finalB   = 236; // (blue  ).

   if (value < rangeMin) {return 'rgb(' + initialR + ',' + initialG + ',' + initialB + ')';}
   if (value > rangeMax) {return 'rgb(' + finalR   + ',' + finalG   + ',' + finalB   + ')';}

   var valueAsFraction = (value - rangeMin) / (rangeMax - rangeMin);
   var r = Math.round(initialR + (finalR - initialR) * (valueAsFraction / 0.5), 0);
   var g = Math.round(initialG + (finalG - initialG) * (valueAsFraction / 0.5), 0);
   var b = Math.round(initialB + (finalB - initialB) * (valueAsFraction / 0.5), 0);

   return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function _addColorKeyDiv()
{
   $(
      '<div class="difference-color-key-div">' +
       '<table style="width:100%">' +
        '<tbody>' +
         '<tr>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 9, 10) + ';text-align:right;">High value</td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 8, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 7, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 6, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 5, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 4, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 3, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 2, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 1, 10) + ';"></td>' +
          '<td style="height:20px;width:10%;background-color:' + _getCssColorForRangeValue(0, 0, 10) + ';">Low value</td>' +
        '</tr>' +
       '</tbody>' +
      '</table>' +
      '<div class="clear-floats"></div>' +
     '</div>'
   ).insertBefore('div#editable-table-search-form-container');
}
