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
console.info('columnKey: ', columnKey);
      var minAndMax   = window.maxAndMinValueByColumnKey[columnKey];
      var columnIndex = $('table.editable-table > thead > tr > th[data-columnKey=' + columnKey + ']');
      var tds         = $('table.editable-table > tbody.main-tbody > tr').children();
console.info('tds: ', tds);

      for (var i = 0; i < tds.length; ++i)
      {
         var tdJq  = $(tds[i]);
console.info('tdJq: ', tdJq);
         var tdVal = tdJq.find('div.value-div').html();

         tdJq.css('backgroundColor', _getCssColorForRangeValue(minAndMax.min, tdVal, minAndMax.max));
      }
   }
}

function _getCssColorForRangeValue(rangeMin, value, rangeMax)
{
   var midpoint = rangeMin + ((rangeMax - rangeMin) / 2);

   // Color scheme from https://www.schemecolor.com/hot-and-cold.php.
   var initialR = 242; var initialG =  51; var initialB =  59; // Too hot    (red   ).
   var midR     = 255; var midG     = 221; var midB     =  62; // Just right (yellow).
   var finalR   =  86; var finalG   = 171; var finalB   = 236; // Too cold   (blue  ).

   if (value < rangeMin) {return 'rgb(' + initialR + ',' + initialG + ',' + initialB + ')';}
   if (value > rangeMax) {return 'rgb(' + finalR   + ',' + finalG   + ',' + finalB   + ')';}

   var valueAsFraction = (value - rangeMin) / (rangeMax - rangeMin);

   switch ((valueAsFraction < 0.5)? 'firstHalf': ((valueAsFraction == 0.5)? 'middle': 'lastHalf'))
   {
    case 'firstHalf':
      var r = Math.round(initialR + (midR - initialR) * (valueAsFraction / 0.5), 0);
      var g = Math.round(initialG + (midG - initialG) * (valueAsFraction / 0.5), 0);
      var b = Math.round(initialB + (midB - initialB) * (valueAsFraction / 0.5), 0);
      break;

    case 'middle':
      var r = midR;
      var g = midG;
      var b = midB;
      break;

    case 'lastHalf':
      var r = Math.round(midR + (finalR - midR) * ((valueAsFraction - 0.5) / 0.5), 0);
      var g = Math.round(midG + (finalG - midG) * ((valueAsFraction - 0.5) / 0.5), 0);
      var b = Math.round(midB + (finalB - midB) * ((valueAsFraction - 0.5) / 0.5), 0);
      break;

    default:
      throw new Exception('Impossible case.');
   }

   return 'rgb(' + r + ',' + g + ',' + b + ')';
}
