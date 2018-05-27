const questionableUUID = () => (Date.now() * Math.random()).toFixed() //I'm sorry
const Dollars = amount => (parseFloat(amount) || 0).toFixed(2);
const Item = (name, cost) => ({
    name: name,
    cost: Dollars(cost),
    id: questionableUUID(),
});

class App extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.add = this.add.bind(this);
        this.clear = this.clear.bind(this);
        this.updateListItem = this.updateListItem.bind(this);
        this.deleteListItem = this.deleteListItem.bind(this);
        this.state = {
            items: [
                Item("bread", 1.85),
                Item("milk", 2.60),
                Item("wine", 7.35),
                Item("cheese", 2.05),
                Item("meat", 14.50),
                Item("salad", 3.50),
            ]
        }; //TODO: LocalStorage
    }
    
    calculateSubtotal()
    {
        let total = 0.0;
        
        for(const item of this.state.items)
            total += parseFloat(item.cost);
        
        return total.toFixed(2);
    }
    
    add()
    {
        const items = this.state.items.slice(0);
        
        items.push(Item("", ""));
        this.setState({items: items});
    }
    
    clear()
    {
        this.setState({items: []});
    }
    
    updateListItem(index, field, newValue)
    {
        const items = this.state.items.slice(0);
        items[index][field] = field == "cost" ? Dollars(newValue) : newValue;
        
        this.setState({items: items});
    }
    
    deleteListItem(index)
    {
        let items = this.state.items.slice(0);
        items = items.slice(0, index).concat(items.slice(index + 1));
        
        console.log("deleteListItem", index, this.state.items, "=>", items);
        this.setState({items: items});
    }
    
    render()
    {
        return (
            <form onSubmit={(event) => event.preventDefault()}>
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
            <button onSubmit={event => event.preventDefault()} onClick={props.add}>Add</button>
            <button onSubmit={event => event.preventDefault()} onClick={props.clear}>Clear</button>
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
        
        this.handleChange = this.handleChange.bind(this);
        //this.handleCostChange = this.handleCostChange.bind(this);
    }
    
    handleChange(event)
    {
        const type = event.target.type;
        const value = event.target.value;
        
        if(type == "text")
            this.props.updateListItem(this.props.index, "name", value);
        else if(type == "number")
            this.props.updateListItem(this.props.index, "cost", value);
        else
            throw new Error("Unknown ListItem input of type " + type);
    }
    
    componentDidUpdate(prevProps)
    {
        if(this.costRef.value == "")
        {
            //input is invalid, revert to previous value
            this.costRef.value = prevProps.cost;
            
            this.props.updateListItem(this.props.index, "cost", prevProps.cost);
        }
        else if(this.costRef.value != this.props.cost)
            this.costRef.value = this.props.cost; //input is out of sync, update it
    }
    
    render()
    {
        return (
            <li>
                <input
                    type="text"
                    placeholder="Item"
                    value={this.props.name}
                    onChange={this.handleChange}
                />
                <input
                    type="number"
                    placeholder="Cost"
                    step="0.01"
                    defaultValue={this.props.cost}
                    ref={costRef => this.costRef = costRef}
                    onBlur={this.handleChange}
                />
                <button onClick={() => this.props.deleteListItem(this.props.index)}>&#x274C;</button>
            </li>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
