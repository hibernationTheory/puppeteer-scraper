function scrapeData(selectorConfig, resultType) {
  // given an element, get the value of the element for the given type.
  function getValueByType(element, type) {
    var value;

    if (type === 'text') {
      value = element.textContent;
    } else {
      value = element.getAttribute(type);
    }

    return value;
  }


  // given a single selector, return the result for it.
  function getSingleSelector(config, parentElement) {
    var selector = config.selector;
    var label = config.label;
    var type = config.type;

    var element = (parentElement || document).querySelector(selector);
    if (!element) {
      return;
    }

    var value = getValueByType(element, type);

    return {
      key: label,
      value: value,
    };
  }

  function getMultipleSelector(config) {
    var key = config.key;
    var selector = config.selector;
    var skipFirst = config.skipFirst || 0;
    var skipLast = config.skipLast || 0;
    var indices = config.indices || [];
    var subSelectors = config.subSelectors;
    var result = {
      key,
      value: [],
    };

    var childElements = document.querySelectorAll(selector);

    // for every child element
    for (var i = 0 + skipFirst; i < childElements.length - skipLast; i++) {
      if (indices.indexOf(i) > -1) {
        continue;
      }
      var childElement = childElements[i];
      var currSubResult = [];

      // for every selection to be made under each children
      for (var j=0; j<subSelectors.length; j++) {
        var currSubSelectorConfig = subSelectors[j];
        var currSubEl = childElement.querySelector(currSubSelectorConfig.selector);
        if (!currSubEl) {
          continue;
        }

        var currSubValue = getSingleSelector(currSubSelectorConfig, childElement);
        if (!currSubValue || currSubValue.length === 0) {
          continue;
        }

        currSubResult.push(currSubValue);
      }

      if (currSubResult.length === 0) {
        continue;
      }

      result.value.push(currSubResult);
    }

    return result;
  }

  // MAIN FUNCTION BODY
  var results = [];

  var singleSelectors = selectorConfig.singleSelectors;
  var multipleSelectors = selectorConfig.multipleSelectors;

  // if (!singleSelectors || !multipleSelectors) {
  //   return results;
  // }

  if (singleSelectors) {
    for (var i = 0; i < singleSelectors.length; i++) {
      var singleSelector = singleSelectors[i];
      results.push(getSingleSelector(singleSelector))
    }
  }

  if (multipleSelectors) {
    for (var i = 0; i < multipleSelectors.length; i++) {
      var multipleSelector = multipleSelectors[i];
      results.push(getMultipleSelector(multipleSelector))
    }
  }

  return results;
}

module.exports = {
  scrapeData: scrapeData,
};
