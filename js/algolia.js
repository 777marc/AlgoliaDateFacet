
// Algolia client. Mandatory to instantiate the Helper.
var algolia = algoliasearch($app_id, $api_key);

// Algolia Helper
var helper = algoliasearchHelper(algolia, 'cruises_all_v2', {
    // Disjunctive facets need to be explicitly defined here
    // It's not the same attribute that is used to configure conjunctive and excluding facets
    disjunctiveFacets: ['Title', 'Vendor'],
    // Misc. configuration for the demo purpose
    hitsPerPage: 5,
    maxValuesPerFacet: 5
});


// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $hits = $('#hits');
var $facets = $('#facets');

$facets.on('click', handleFacetClick);

// Trigger a first search, so that we have a page with results
// from the start.
helper.search();

// Result event callback
function searchCallback(results) {
    if (results.hits.length === 0) {
        // If there is no result we display a friendly message
        // instead of an empty page.
        $hits.empty().html("No results :(");
        return;
    }

    // Hits/results rendering
    renderHits($hits, results);
    renderFacets($facets, results);
}


function renderFacets($facets, results) {
    // We use the disjunctive facets attribute.
    var facets = results.disjunctiveFacets.map(function(facet) {
        var name = facet.name;
        var header = '<h4>' + name + '</h4>';
        var facetValues = results.getFacetValues(name);
        var facetsValuesList = $.map(facetValues, function(facetValue) {
            var facetValueClass = facetValue.isRefined ? 'refined'  : '';
            var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
            return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
        })
        return header + '<ul>' + facetsValuesList.join('') + '</ul>';
    });

    $facets.html(facets.join(''));
}

function handleFacetClick(e) {
    e.preventDefault();
    var target = e.target;
    var attribute = target.dataset.attribute;
    var value = target.dataset.value;
    // Because we are listening in the parent, the user might click where there is no data
    if(!attribute || !value) return;
    // The toggleRefine method works for disjunctive facets as well
    helper.toggleRefine(attribute, value).search();
}

function renderHits($hits, results) {
    var hits = results.hits.map(function renderHit(hit) {
        var highlighted = hit._highlightResult;
        var attributes = $.map(highlighted, function renderAttributes(attribute, name) {
            return (
            '<div class="attribute">' +
            '<strong>' + name + ': </strong>' + attribute.value +
            '</div>');
        }).join('');
        return '<div class="hit panel">' + attributes + '</div>';
    });
    $hits.html(hits);
}