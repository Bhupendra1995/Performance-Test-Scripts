/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7701662185284771, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03_02_Click on Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "04_04 Click on Category"], "isController": true}, {"data": [0.5, 500, 1500, "03_01_OpenUrl"], "isController": true}, {"data": [1.0, 500, 1500, "03_07 Click on Sign off"], "isController": true}, {"data": [1.0, 500, 1500, "04_02 Click on Sign in"], "isController": true}, {"data": [0.996415770609319, 500, 1500, "02_03 Click on Product id"], "isController": true}, {"data": [0.5, 500, 1500, "02_01 OpenURl"], "isController": true}, {"data": [0.9978749241044323, 500, 1500, "01_02_Search"], "isController": true}, {"data": [1.0, 500, 1500, "02_04 Click on Item Id"], "isController": true}, {"data": [0.5, 500, 1500, "04_01 Open Url"], "isController": true}, {"data": [1.0, 500, 1500, "04_05 Click on Product id"], "isController": true}, {"data": [1.0, 500, 1500, "04_10 Click on Sign off"], "isController": true}, {"data": [0.9966555183946488, 500, 1500, "02_02 Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "03_04_Click on Category id"], "isController": true}, {"data": [1.0, 500, 1500, "03_06 Click on Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "04_03 Enter Username and password-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_07 Click on Proceed to checkout"], "isController": true}, {"data": [1.0, 500, 1500, "04_10 Click on Sign off-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_03 Enter Username and password"], "isController": true}, {"data": [1.0, 500, 1500, "04_10 Click on Sign off-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_03 Enter Username and password-1"], "isController": false}, {"data": [0.49896080760095013, 500, 1500, "01_01_OpenUrl"], "isController": false}, {"data": [1.0, 500, 1500, "04_09 Click on Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_Key in Username and password and login-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_06 Click on Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "03_05_Click on Product id"], "isController": true}, {"data": [1.0, 500, 1500, "04_08 Key in Payment details and confirm"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_Key in Username and password and login-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_07 Click on Sign off-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_07 Click on Sign off-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_03_Key in Username and password and login"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4189, 0, 0.0, 396.13105753163023, 0, 5249, 174.0, 693.0, 728.0, 939.9000000000033, 41.990777866880514, 172.2401439235415, 30.203778130012026], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_02_Click on Sign in", 45, 0, 0.0, 155.1555555555555, 0, 199, 164.0, 182.79999999999998, 197.2, 199.0, 0.4728331109266478, 1.765017869151317, 0.2637522196887707], "isController": true}, {"data": ["04_04 Click on Category", 2, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 0.3502626970227671, 1.4875903021015762, 0.21549365148861646], "isController": true}, {"data": ["03_01_OpenUrl", 48, 0, 0.0, 674.5833333333333, 612, 876, 667.0, 714.5, 813.4499999999996, 876.0, 0.5001146095980329, 2.541272479109796, 0.2736629748484028], "isController": true}, {"data": ["03_07 Click on Sign off", 32, 0, 0.0, 318.68749999999994, 298, 345, 321.0, 337.0, 345.0, 345.0, 0.4839099927413501, 2.4942157633680138, 0.6015795124606823], "isController": true}, {"data": ["04_02 Click on Sign in", 4, 0, 0.0, 158.5, 154, 163, 158.5, 163.0, 163.0, 163.0, 0.060407448238367786, 0.24162979295347117, 0.038698521527704366], "isController": true}, {"data": ["02_03 Click on Product id", 279, 0, 0.0, 180.5089605734767, 0, 5249, 163.0, 174.0, 183.0, 468.0, 3.111651405819569, 11.932484344155338, 1.9617510497641168], "isController": true}, {"data": ["02_01 OpenURl", 316, 0, 0.0, 673.7848101265822, 597, 1100, 663.0, 724.0, 791.0, 1051.0, 3.2430546290499698, 16.165241843614982, 1.7986814186311437], "isController": true}, {"data": ["01_02_Search", 3294, 0, 0.0, 163.38160291438976, 0, 2258, 160.0, 172.0, 176.0, 234.10000000000036, 33.60504381714122, 115.69993611062935, 31.36206144601667], "isController": true}, {"data": ["02_04 Click on Item Id", 263, 0, 0.0, 159.7566539923956, 0, 243, 162.0, 171.6, 177.0, 232.76000000000022, 3.092625909855246, 11.19074181865218, 1.927792550064087], "isController": true}, {"data": ["04_01 Open Url", 4, 0, 0.0, 741.0, 645, 837, 741.0, 837.0, 837.0, 837.0, 0.06663557006730193, 0.3460949994169388, 0.03588820008995802], "isController": true}, {"data": ["04_05 Click on Product id", 2, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 0.37516413430876006, 1.5567113346464077, 0.24253775089101481], "isController": true}, {"data": ["04_10 Click on Sign off", 2, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 0.3722315280104225, 1.9185918016005954, 0.45620172622371113], "isController": true}, {"data": ["02_02 Click on Category", 299, 0, 0.0, 159.25752508361202, 0, 699, 162.0, 173.0, 176.0, 183.0, 3.0905351070317426, 11.044108602850734, 1.8215802234177805], "isController": true}, {"data": ["03_04_Click on Category id", 35, 0, 0.0, 152.22857142857146, 0, 235, 161.0, 172.0, 235.0, 235.0, 0.4582351400890285, 1.6110851990049753, 0.25831983176224144], "isController": true}, {"data": ["03_06 Click on Add to cart", 32, 0, 0.0, 162.93750000000003, 151, 177, 164.0, 172.0, 177.0, 177.0, 0.4840856831659204, 2.275208620128888, 0.31431295761224737], "isController": true}, {"data": ["04_03 Enter Username and password-0", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.4776932565789473, 6.456877055921053], "isController": false}, {"data": ["04_07 Click on Proceed to checkout", 2, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 0.3292181069958848, 1.7827289094650205, 0.20704732510288065], "isController": true}, {"data": ["04_10 Click on Sign off-1", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 32.64693708609271, 4.029128725165563], "isController": false}, {"data": ["04_03 Enter Username and password", 3, 0, 0.0, 202.66666666666669, 0, 304, 304.0, 304.0, 304.0, 304.0, 0.05068423720223011, 0.1772628400067579, 0.05771271540800811], "isController": true}, {"data": ["04_10 Click on Sign off-0", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.4776932565789473, 4.060444078947368], "isController": false}, {"data": ["04_03 Enter Username and password-1", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 33.036081414473685, 4.780016447368421], "isController": false}, {"data": ["01_01_OpenUrl", 3368, 0, 0.0, 678.1852731591438, 0, 2103, 658.0, 734.0, 780.0, 1167.0, 33.76102646351243, 165.1730559593023, 18.988081160409983], "isController": false}, {"data": ["04_09 Click on Confirm", 2, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 0.27311211252219036, 1.4317049023624198, 0.1656275604260549], "isController": true}, {"data": ["03_03_Key in Username and password and login-1", 19, 0, 0.0, 161.52631578947367, 150, 176, 162.0, 172.0, 176.0, 176.0, 0.24820054604120131, 1.2463351638123603, 0.16966834202035244], "isController": false}, {"data": ["04_06 Click on Add to cart", 2, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 0.3870718018192375, 1.8174230694793885, 0.2509918714921618], "isController": true}, {"data": ["03_05_Click on Product id", 32, 0, 0.0, 163.0, 150, 184, 160.0, 176.0, 184.0, 184.0, 0.4867512396945636, 1.9813782000091265, 0.31479590672629365], "isController": true}, {"data": ["04_08 Key in Payment details and confirm", 2, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 0.24700506360380386, 1.126478170927504, 0.305138091268371], "isController": true}, {"data": ["03_03_Key in Username and password and login-0", 19, 0, 0.0, 162.10526315789474, 149, 183, 164.0, 173.0, 183.0, 183.0, 0.2481357171775215, 0.05573360835041987, 0.2328695548902326], "isController": false}, {"data": ["03_07 Click on Sign off-0", 16, 0, 0.0, 158.9375, 149, 174, 159.0, 169.1, 174.0, 174.0, 0.263587090822227, 0.059204131727648636, 0.16499934103227296], "isController": false}, {"data": ["03_07 Click on Sign off-1", 16, 0, 0.0, 159.43750000000003, 148, 175, 160.0, 172.9, 175.0, 175.0, 0.2637000412031314, 1.299958796868562, 0.1627523691800577], "isController": false}, {"data": ["03_03_Key in Username and password and login", 40, 0, 0.0, 307.8, 0, 346, 326.5, 344.7, 345.95, 346.0, 0.47504809861998526, 2.367539518063704, 0.7320333468919978], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4189, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
