import React, { useState, useEffect } from 'react';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import arrayMoveMutable from 'array-move';

export default function Checklist( props ) {
  const { items, setItems } = props

  const [newItem, setNewItem] = useState('');

  const [ newValue, setNewValue ] = useState( [] )

 	useEffect( () => {
		setNewValue( items )
	}, [])

	useEffect( () => {
		setItems( newValue )
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
	  <h1>Checklist</h1>
	  <SortableList onSortEnd={handleOnSortEnd}>
		{newValue.map((item, index) => (
		  <SortableItem key={index}>
			<div>
			<SortableKnob>
				<span>Move</span>
			</SortableKnob>
			  <input
				type="checkbox"
				checked={item.completed}
				onChange={() => handleToggleComplete(index)}
			  />
			  {item.text}
			  <button className='soivigol-btn-remove' onClick={() => handleRemoveItem(index)}>
			  	<svg width='16' height='16' viewBox="0 0 448 512">
					<path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
				</svg>
			  </button>
			</div>
		  </SortableItem>
		))}
	  </SortableList>

	  <div>
		<input type="text" value={newItem} onChange={handleInputChange} />
		<button onClick={handleAddItem}>Add</button>
	  </div>
	</div>
  );
};
