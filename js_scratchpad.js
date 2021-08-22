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

$(document).ready
(
   function ()
   {
      _setBackgroundColorsForColumnsWithMinAndMaxValues();
   }
);

function _setBackgroundColorsForColumnsWithMinAndMaxValues()
{
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
