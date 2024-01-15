$(document).ready(function () {

    var outletArray = [];
    var mainOutletArray = [];
    var outletsNameArray = [];

    var $mainOutletDropDown = $("#DropDown_outlet");
    var $outletNameDropDown = $("#DropDown_outletName");
    var $container = $("#search_res");
    var $secondaryDataContainer = $("#secondary_data_container"); // Add this line

    // Fill the first dropdown with data.
    $.getJSON('./EBUL-MERCHANT-LOCATIONS.json', function (data) {
        // Extracting mainOutlet names from JSON keys
        outletArray = Object.keys(data);

        // Sorting the outlets
        outletArray.sort();

        // Append the outlets to the first dropdown
        $.each(outletArray, function (i, mainOutlet) {
            $mainOutletDropDown.append('<option value="' + mainOutlet + '">' + mainOutlet + '</option>');
        });

        $mainOutletDropDown.change(function () {
            var selectedMainOutlet = this.value;

            // Filter based on selected mainOutlet.
            outletsNameArray = data[selectedMainOutlet];

            $outletNameDropDown.empty();
            $outletNameDropDown.append('<option value="None">None</option>');

            outletsNameArray.forEach(function (location) {
                if ($.inArray(location["OUTLET NAME"], mainOutletArray) == -1) {
                    $outletNameDropDown.append('<option value="' + location["OUTLET NAME"] + '">' + location["OUTLET NAME"] + '</option>');
                    mainOutletArray.push(location["OUTLET NAME"]);
                }
            });

            updateTable(outletsNameArray);
        });

        $outletNameDropDown.change(function () {
            var selectedOutletName = this.value;

            // Filter select based on selected outlet name
            var selectedArray = outletsNameArray.filter(function (location) {
                return location["OUTLET NAME"] == selectedOutletName;
            });

            updateTable(selectedArray);
            displaySecondaryData(selectedArray);
        });

        // To update the table element with selected items
     // To update the table element with selected items
function updateTable(collection) {
    $container.empty();

    var uniqueLocations = new Set();

    collection.forEach(function (location) {
        var locationKey = location["OUTLET NAME"] + location["LOCATION"];

        // Check if location is already added to the set
        if (!uniqueLocations.has(locationKey)) {
            $("#main_outlet_name").html("<p class='sort_style'>Results for " + location["OUTLET NAME"] + " , " + location["LOCATION"] + "</p><p class='no_record'>"
                + collection.length + " Filling outlets found</p>")
            $(".search_pre_message").hide("slow");

            $container.append("<div class='col-md-3 space_padding'><div class='blur-effect flip-card-back'><h4 class='' style='color: #00B8DE; height:55px'>"
                + location["OUTLET NAME"] + "</h4><p class='location-title'><i class='fa fa-map-marker' style='color: #DC4437; font-size: 23px;'></i>  "
                + location["LOCATION"] + "</p></div></div>");

            // Add the location to the set
            uniqueLocations.add(locationKey);
        }
    });
}

        // Function to display secondary data the location
        function displaySecondaryData(selectedArray) {
            // this part is based on my HTML structure to display secondary data
            $secondaryDataContainer.empty();

            selectedArray.forEach(function (location) {
                // I Checked if the secondary property exists
                if (location.hasOwnProperty("LOCATION")) {
                    var styledLocation = "<span style='color: #00425f; font-weight: bold;'>" + location["LOCATION"] + "</span>";
                    // I Customized the HTML structure to display secondary data
                    $secondaryDataContainer.append("<p style='font-weight: 700; box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.096);  color: #00425f;  padding: 70px 30px;   font-size: 20px !important; margin-top: 15px;'> <i class='fa fa-map-marker' style='color: #DC4437; font-size: 23px; padding-left: 5px;'></i>  Location: " + styledLocation + "</p>");
                } else {
                    $secondaryDataContainer.append("<p>location not available</p>");
                }
            });
        }

    })
    .done(function() { console.log('success!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { $("#error_msg").html('Request failed! '); });

    // Your other code...
});
