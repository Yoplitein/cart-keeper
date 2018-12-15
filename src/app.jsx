import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

const questionableUUID = () => (Date.now() * Math.random()).toFixed() //I'm sorry
const Dollars = amount => (parseFloat(amount) || 0).toFixed(2);
const Quantity = amount => Math.max(parseFloat(amount) || 0, 1).toFixed();
const Item = (name, cost, quantity = 1) => ({
    name: name,
    cost: Dollars(cost),
    quantity: Quantity(quantity),
    id: questionableUUID(),
});

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            items: [
                Item("", 0),
            ]
        }; //TODO: LocalStorage
    }
    
    calculateSubtotal = () =>
    {
        let total = 0.0;
        
        for(const item of this.state.items)
            total += parseFloat(item.quantity) * parseFloat(item.cost);
        
        return total.toFixed(2);
    };
    
    add = () =>
    {
        const items = this.state.items.slice(0);
        
        items.push(Item("", ""));
        this.setState({items: items});
    };
    
    clear = () =>
    {
        this.setState({items: []});
    };
    
    updateListItem = (index, field, newValue) =>
    {
        const items = this.state.items.slice(0);
        items[index][field] = field == "cost" ? Dollars(newValue) : newValue;
        
        this.setState({items: items});
    };
    
    deleteListItem = (index) =>
    {
        let items = this.state.items.slice(0);
        items = items.slice(0, index).concat(items.slice(index + 1));
        
        console.log("deleteListItem", index, this.state.items, "=>", items);
        this.setState({items: items});
    };
    
    render()
    {
        return (
            <form onSubmit={event => event.preventDefault()}>
                <Bar subtotal={this.calculateSubtotal()} add={this.add} clear={this.clear} />
                <List items={this.state.items} updateListItem={this.updateListItem} deleteListItem={this.deleteListItem} />
            </form>
        );
    }
}

function Bar(props)
{
    return (
        <div id="bar">
            <button type="button" onClick={props.add}>Add</button>
            <button type="button" onClick={props.clear}>Clear</button>
            <label>
                Subtotal
                $<span id="subtotal">{props.subtotal}</span>
            </label>
        </div>
    );
}

function List(props)
{
    const items = props.items.map(
        (item, index) =>
            <ListItem
                key={item.id}
                index={index}
                name={item.name}
                quantity={item.quantity}
                cost={item.cost}
                updateListItem={props.updateListItem}
                deleteListItem={props.deleteListItem}
            />
    );
    
    return (
        <div id="list">
            <ul>
                {items}
            </ul>
        </div>
    );
}

class ListItem extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    
    render()
    {
        return (
            <li>
                <input
                    type="text"
                    name="name"
                    placeholder="Item"
                    value={this.props.name}
                    onChange={event => this.props.updateListItem(this.props.index, "name", event.target.value)}
                />
                <NumberField
                    name="quantity"
                    value={this.props.quantity}
                    onChange={newValue => this.props.updateListItem(this.props.index, "quantity", Quantity(newValue))}
                />
                <NumberField
                    name="cost"
                    min="0.01"
                    step="0.01"
                    value={this.props.cost}
                    onChange={newValue => this.props.updateListItem(this.props.index, "cost", Dollars(newValue))}
                />
                <span>${Dollars(this.props.quantity * this.props.cost)}</span>
                <button type="button" onClick={() => this.props.deleteListItem(this.props.index)}>&#x274C;</button>
            </li>
        );
    }
}

class NumberField extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    
    componentDidUpdate(prevProps)
    {
        if(this.ref.value == "")
        {
            //input is invalid, revert to previous value
            this.ref.value = prevProps.value;
            
            this.props.onChange(this.props.name, prevProps.value);
        }
        else if(this.ref.value != this.props.value)
            this.ref.value = this.props.value; //input is out of sync, update it
    }
    
    render()
    {
        const {name, placeholder, min, max, step, value, onChange} = this.props;
        
        return <input
            type="text"
            name={name}
            placeholder={placeholder || name.slice(0, 1).toUpperCase() + name.slice(1)}
            min={min || 1}
            max={max || 1e5}
            step={step || 1}
            defaultValue={value}
            ref={ref => this.ref = ref}
            onBlur={(event) => onChange(this.ref.value)}
        />;
    }
}

function main()
{
    const root = document.createElement("div");
    root.id = "root";
    
    document.body.appendChild(root);
    ReactDOM.render(<App />, root);
}

main();
