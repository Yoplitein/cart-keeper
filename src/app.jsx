import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

const questionableUUID = () => (Date.now() * Math.random()).toFixed() //I'm sorry
const Dollars = amount => (parseFloat(amount) || 0).toFixed(2);
const Tax = amount => (parseFloat(amount) || 0).toFixed(2);
const Weight = amount => (parseFloat(amount) || 0).toFixed(1);
const Quantity = amount => Math.max(parseFloat(amount) || 0, 1).toFixed();
const Item = (name, cost, quantity = 1, quantityConversion = Quantity) => ({
    name: name,
    cost: Dollars(cost),
    quantity: quantityConversion(quantity),
    id: questionableUUID(),
    quantityConversion: quantityConversion,
});

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            items: [
                Item("", 0),
            ],
            taxRate: 0,
        }; //TODO: LocalStorage
    }
    
    calculateSubtotal = () =>
    {
        let total = 0.0;
        
        for(const item of this.state.items)
            total += parseFloat(item.quantity) * parseFloat(item.cost);
        
        return Dollars(total);
    };
    
    calculateTax = (subtotal) =>
    {
        return Dollars(subtotal * (this.state.taxRate / 100));
    };
    
    add = () =>
    {
        const items = this.state.items.slice(0);
        
        items.push(Item("", 0));
        this.setState({items: items});
    };
    
    addWeighted = () =>
    {
        const items = this.state.items.slice(0);
        
        items.push(Item("", 0, 0, Weight));
        this.setState({items: items});
    };
    
    clear = () =>
    {
        this.setState({items: []});
    };
    
    updateListItem = (index, field, newValue) =>
    {
        const items = this.state.items.slice(0);
        items[index][field] = newValue;
        
        this.setState({items: items});
    };
    
    deleteListItem = (index) =>
    {
        let items = this.state.items.slice(0);
        items = items.slice(0, index).concat(items.slice(index + 1));
        
        this.setState({items: items});
    };
    
    render()
    {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        
        return (
            <form onSubmit={event => event.preventDefault()}>
                <Bar
                    subtotal={subtotal}
                    tax={tax}
                    taxRate={this.state.taxRate}
                    setTaxRate={newTaxRate => this.setState({taxRate: newTaxRate})}
                    add={this.add}
                    addWeighted={this.addWeighted}
                    clear={this.clear}
                />
                <List
                    items={this.state.items}
                    updateListItem={this.updateListItem}
                    deleteListItem={this.deleteListItem}
                />
            </form>
        );
    }
}

function Bar(props)
{
    return (
        <div id="bar">
            <button type="button" onClick={props.add}>Add</button>
            <button type="button" onClick={props.addWeighted}>Add Weighted</button>
            <button type="button" onClick={props.clear}>Clear</button>
            <br />
            <label>
                Tax rate
                <NumberField
                    name="tax"
                    step="0.25"
                    value={props.taxRate}
                    onChange={value => props.setTaxRate(Tax(value))}
                />
            </label>
            <ul>
                <li>
                    Subtotal
                    $<span id="subtotal">{props.subtotal}</span>
                </li>
                <li>
                    Tax
                    $<span id="tax">{props.tax}</span>
                </li>
            </ul>
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
                quantityConversion={item.quantityConversion}
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
                    placeholder={this.props.quantityConversion.name}
                    value={this.props.quantity}
                    onChange={newValue => this.props.updateListItem(this.props.index, "quantity", this.props.quantityConversion(newValue))}
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
