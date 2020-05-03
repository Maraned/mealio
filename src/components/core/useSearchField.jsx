import './useSearchField.css';

import React, { useState, useEffect, useMemo } from 'react';
// import Fuse from 'fuse';
import Miniserach from 'minisearch';
import { FaSearch } from 'react-icons/fa';
 
export default function SearchField(items, fields = []) {
  const [query, setQuery] = useState('');
  console.log('query, query')

  const searchEngine = useMemo(() => {
    const fieldsToReturn = items[0] ? Object.keys(items[0]) : [];
    // return new Fuse(items, { keys: fields });
    const newSearchEngine = new Miniserach({
      fields,
      storeFields: fieldsToReturn,
      // extractField: (document, fieldName) => {
      //   // Access nested fields
      //   const value = fieldName.split('.').reduce((doc, key) => doc && doc[key], document)
      //   // If field value is an array, join by space
      //   return Array.isArray(value) ? value.join(' ') : value
      // }
    });
    newSearchEngine.addAll(items);
    return newSearchEngine;
  }, [fields, items]);

  const filteredItems = useMemo(() => {
    if (!query) {
      return items;
    }
    
    return searchEngine.search(query, {
      prefix: true,
      fuzzy: 0.2,
    });
  }, [items, query]);
  
  const searchField = (
    <div className="searchField">
      <input 
        className="searchField__input" 
        value={query} 
        onChange={event => setQuery(event.target.value)}
      />

      <FaSearch className="searchField__icon" />
    </div>
  );

  return [searchField, filteredItems];
} 
