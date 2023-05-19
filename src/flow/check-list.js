import React, { useState, useEffect } from 'react';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import arrayMoveMutable from 'array-move';

import './check-list.scss';

// Simple check list with a checkbox to mark if it is done and move it.
// It's neccesary pass the array with following objects struture {text:string, completed:boolean}
// Also it's neccesary pass the function to set news items.
export default function Checklist( props ) {
  const { items, setItems, loading = true } = props

  const [newItem, setNewItem] = useState('');

  const [ newValue, setNewValue ] = useState( [] )

 	useEffect( () => {
		if ( items.toString() !== newValue.toString() ) {console.log( items )
			setNewValue( items )
		}
	}, [loading])

	useEffect( () => {
		if ( loading ) {
			setItems( newValue )
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newValue])

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleAddItem = () => {
	if (newItem.trim() !== '') {
	  setNewValue([...items, { text: newItem, completed: false }]);
	  setNewItem('');
	}
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setNewValue(updatedItems);
  };

  const handleToggleComplete = (index) => {
	const updatedItems = [...items];
	updatedItems[index].completed = !updatedItems[index].completed;
	setNewValue(updatedItems);
  };

  const handleOnSortEnd = (oldIndex, newIndex) => {
	const newArray = (array) => arrayMoveMutable(array, oldIndex, newIndex )
	setNewValue( newArray )
  };

  return (
	<div>
	  <SortableList onSortEnd={handleOnSortEnd}>
		{newValue.map((item, index) => (
		  <SortableItem key={index}>
			<div className='check-list-item'>
			<SortableKnob>
				<span class="dashicons dashicons-move"></span>
			</SortableKnob>
			  <input
				type="checkbox"
				checked={item.completed}
				onChange={() => handleToggleComplete(index)}
			  />
			  {item.text}
			  <span class="dashicons dashicons-trash soivigol-btn-remove" onClick={() => handleRemoveItem(index)}></span>
			</div>
		  </SortableItem>
		))}
	  </SortableList>

	  <div className='check-list-form'>
		<input type="text" value={newItem} onChange={handleInputChange} />
		<button onClick={handleAddItem}>Add</button>
	  </div>
	</div>
  );
};
