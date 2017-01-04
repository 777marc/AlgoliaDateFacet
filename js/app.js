/**
 * Created by marcmendoza on 1/2/17.
 */


$(function () {

    var dateFormat = "mm/dd/yy",
        from = $( "#from" )
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 3
            })
            .on( "change", function() {
                to.datepicker( "option", "minDate", getDate( this ) );
            }),
        to = $( "#to" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 3
        })
            .on( "change", function() {
                from.datepicker( "option", "maxDate", getDate( this ) );
            });

    function getDate( element ) {
        var date;
        try {
            date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
            date = null;
        }

        return date;
    }

    $('#from').on('change', function () {
        var uts = new Date($('#from').val()).getTime() / 1000;
        $('#lbl-from-message').text(uts);

        if(! isNaN(uts)) {
            helper.addNumericRefinement('sort_date','>=',uts).search();
        }

    });

    $('#to').on('change', function () {
        var uts = new Date($('#to').val()).getTime() / 1000;
        $('#lbl-to-message').text(uts);

        if(! isNaN(uts)) {
            helper.addNumericRefinement('sort_date','<=',uts).search();
        }

    });

})
