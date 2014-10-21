module.exports = function(earnings){
    $("#output").empty();
    var output = $("<table id=output-table></table>").addClass("table table-striped display");
    var head = $("<thead></thead>");
    var tbody = $("<tbody></tbody>");
    $("#output").append(output);
    head.append("<tr><th>Year</th><th>Earnings</th><th>Inflated</th><th>Inflation Percent</th><th>Inflation Calc</th></tr>");
    output.append(head).end().append(tbody);
    
    for (var i = 0; i < earnings.length; i++) {
        var row = $("<tr></tr>");
        tbody.append(row);
        if (earnings[i].isTopYear){
          row.addClass('top-year');
        }
        row.append($("<td></td>").text(earnings[i].year));
        row.append($("<td></td>").text(earnings[i].ssEarnings));
        row.append($("<td></td>").text(earnings[i].inflatedEarnings));
        row.append($("<td></td>").text(earnings[i].inflationPercent));
        row.append($("<td></td>").text(earnings[i].inflationCalc));
        output.append(tbody);
    }
    $("#output-table").dataTable({
        "paging":   false,
        "ordering": true,
        "order": [[ 2, "desc" ]],
        "info":     false,
        "searching":   false
    });

};