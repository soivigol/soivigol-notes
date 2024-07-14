import React, { useState, useEffect } from 'react';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import { arrayMoveMutable } from 'array-move';

import { __ } from '@wordpress/i18n';

import './check-list.scss';

// Simple check list with a checkbox to mark if it is done and move it.
// It's neccesary pass the array with following objects struture {text:string, completed:boolean}
// Also it's neccesary pass the function to set news items.
export default function Checklist( props ) {
  const { items, setItems, loading = true, edit = true } = props

  const [newItem, setNewItem] = useState('');

  const [ newValue, setNewValue ] = useState( [] )

 	useEffect( () => {
		if ( items.toString() !== newValue.toString() ) {
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
	  setNewValue([...newValue, { text: newItem, completed: false }]);
	  setNewItem('');
	}
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...newValue];
    updatedItems.splice(index, 1);
    setNewValue(updatedItems);
  };

  const handleToggleComplete = (index) => {
	const updatedItems = [...newValue];
	updatedItems[index].completed = ! updatedItems[index].completed;
	setNewValue(updatedItems);
  };

  const handleOnSortEnd = (oldIndex, newIndex) => {
	const newArray = (array) => arrayMoveMutable(array, oldIndex, newIndex )
	setNewValue( newArray )
  };

  return (
	<div>
	  {
		edit ? (
			<>
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
							id= { `check-list-${ index }` }
							onChange={() => handleToggleComplete(index)}
						/>
					<label for= { `check-list-${ index }` } >{item.text}</label>
					<span class="dashicons dashicons-trash soivigol-btn-remove" onClick={() => handleRemoveItem(index)}></span>
					</div>
				</SortableItem>
				))}
			</SortableList>

			<div className='check-list-form'>
				<input type="text" value={newItem} onChange={handleInputChange} />
				<button onClick={handleAddItem}>{ __( 'Add', 'soivigol-notes' ) }</button>
			</div>
			</>
		) : (
			<div>
				{ newValue.map( ( item, index ) => (
					<div className='check-list-item'>
						<input
							type="checkbox"
							checked={ item.completed }
							id= { `check-list-${ index }` }
							onChange={() => handleToggleComplete( index ) }
						/>
						<label for={ `check-list-${ index }` }>{item.text}</label>
					</div>
				))}
			</div>
		)
	  }
	</div>
  );
};
