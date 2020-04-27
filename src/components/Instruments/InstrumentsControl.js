import React from "react";
import InstrumentsList from "./InstrumentsList";
import NewInstrumentForm from "./NewInstrumentForm";
import EditInstrumentForm from "./EditInstrumentForm";
import InstrumentDetail from "./InstrumentDetail";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { v4 } from "uuid";

/* Seed Data */
const masterInstrumentList = [
  {
    id: v4(),
    category: "Guitar",
    itemName: "The Guitarrro",
    description: "hard-coded guitar",
    price: 199.99,
    quantity: 3,
    image:
      "https://images.reverb.com/image/upload/s--hCvA1Gix--/f_auto,t_large/v1559759198/bghge6q0jidiwxumevwe.png",
  },
  {
    id: v4(),
    category: "Piano",
    itemName: "El Piano",
    description: "hard-coded piano",
    price: 899.99,
    quantity: 0,
    image:
      "https://kawaius.com/wp-content/uploads/2018/04/Kawai-Novus-NV10.jpg",
  },
  {
    id: v4(),
    category: "Saxophone",
    itemName: "The In-Stocksophone",
    description: "this is an example of an in-stock item",
    price: 699.99,
    quantity: 8,
    image:
      "https://cdn.shoplightspeed.com/shops/612125/files/5871002/image.jpg",
  },
  {
    id: v4(),
    category: "Piano",
    itemName: "El Piano Dos",
    description: "hard-coded piano",
    price: 899.99,
    quantity: 1,
    image:
      "https://kawaius.com/wp-content/uploads/2018/04/Kawai-Novus-NV10.jpg",
  },
  {
    id: v4(),
    category: "Guitar",
    itemName: "The Guitarrito",
    description: "hard-coded guitar",
    price: 199.99,
    quantity: 3,
    image:
      "https://images.reverb.com/image/upload/s--hCvA1Gix--/f_auto,t_large/v1559759198/bghge6q0jidiwxumevwe.png",
  },
  {
    id: v4(),
    category: "Saxophone",
    itemName: "The Out-of-Stocksophone",
    description: "this is an example of an out-of-stock item.  It's over 9000!",
    price: 9000.99,
    quantity: 0,
    image:
      "https://cdn.shoplightspeed.com/shops/612125/files/5871002/image.jpg",
  },
];

/* Styles */
const controlStyle = {
  marginBottom: 40,
};
const buttonStyle = {
  margin: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

/* 
Instruments Control
 */
class InstrumentsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedInstrument: null,
      addNewInstrumentFormVisible: false,
      editInstrumentFormVisible: false,
      quantityChanged: false,
    };
  }

  handleToggleNewInstrumentForm = () => {
    if (this.state.selectedInstrument != null) {
      this.setState(() => ({
        selectedInstrument: null,
        editInstrumentFormVisible: false,
      }));
    } else {
      this.setState((prevState) => ({
        addNewInstrumentFormVisible: !prevState.addNewInstrumentFormVisible,
      }));
    }
  };

  handleAddingNewInstrumentToList = (newInstrument) => {
    if (newInstrument.image === "") {
      newInstrument.image = "./default-img.jpeg";
    }
    const { dispatch } = this.props;
    const { id, category, itemName, description, price, quantity, image } = newInstrument;
    const action = {
      type: 'ADD_INSTRUMENT',
      id: id,
      category: category,
      itemName: itemName,
      description: description,
      price: price,
      quantity: quantity,
      image: image,
    }
    dispatch(action);
    this.setState({ addNewInstrumentFormVisible: false });
  };

  handleChangingQuantity = (id, newQuantity) => {
    const quantityChanged = this.props.masterInstrumentList[id];
    let changedquantity = parseInt(quantityChanged.quantity);
    changedquantity += newQuantity;
    quantityChanged.quantity = changedquantity;
    //quantityChanged.quantity += newQuantity;
    if (quantityChanged.quantity <= 0) {
      quantityChanged.quantity = 0;
    }
    this.setState({ quantityChanged: quantityChanged });
    this.setState({ quantityChanged: false });
  };

  handleChangingSelectedInstrument = (id) => {
    const selectedInstrument = this.props.masterInstrumentList[id];
    this.setState({ selectedInstrument: selectedInstrument });
  };

  handleEditClick = () => {
    this.setState({ editInstrumentFormVisible: true });
  };

  handleEditingInstrument = (editedInstrument) => {
    const { dispatch } = this.props;
    const { id, category, itemName, description, price, quantity, image } = editedInstrument;
    const action = {
      type: 'ADD_INSTRUMENT',
      id: id,
      category: category,
      itemName: itemName,
      description: description,
      price: price,
      quantity: quantity,
      image: image,
    }
    dispatch(action);
    this.setState({
      editInstrumentFormVisible: false,
      selectedInstrument: null,
    });
  };

  handleDeletingInstrument = (id) => {
    const { dispatch } = this.props;
    const action = {
      type: 'DELETE_INSTRUMENT',
      id: id
    }
    dispatch(action);
    this.setState({ selectedInstrument: null });
  };

  setVisibility = () => {
    if (this.state.editInstrumentFormVisible) {
      // UPDATE: Edit instrument form view
      return {
        component: (
          <EditInstrumentForm
            instrument={this.state.selectedInstrument}
            onEditInstrument={this.handleEditingInstrument}
          />
        ),
        buttonText: "Cancel and return to Instruments List",
      };
    } else if (this.state.selectedInstrument != null) {
      // READ ONE: instrument detail view
      // DELETE: Add delete button to detail view
      return {
        component: (
          <InstrumentDetail
            instrument={this.state.selectedInstrument}
            onClickingDelete={this.handleDeletingInstrument}
            onClickingEdit={this.handleEditClick}
          />
        ),
        buttonText: "Return to Instruments List",
      };
    } else if (this.state.addNewInstrumentFormVisible) {
      // CREATE: Add new instrument form view
      return {
        component: (
          <NewInstrumentForm
            onAddInstrument={this.handleAddingNewInstrumentToList}
          />
        ),
        buttonText: "Return to Instruments List",
      };
    } else if (this.state.quantityChanged) {
      // Quantity changing on "index" grid view
      return {
        component: (
          <InstrumentsList
            onQuantityChanged={this.handleChangingQuantity}
            instrumentList={this.props.masterInstrumentList}
          />
        ),
      };
    } else {
      // READ ALL: "index" grid view
      return {
        component: (
          <InstrumentsList
            onInstrumentSelect={this.handleChangingSelectedInstrument}
            onQuantityChanged={this.handleChangingQuantity}
            instrumentList={this.props.masterInstrumentList}
          />
        ),
        buttonText: "Add Instrument",
      };
    }
  };

  render() {
    const currentlyVisibleState = this.setVisibility();
    return (
      <React.Fragment>
        <div style={controlStyle}>
          <div style={buttonStyle} className="btn-group text-center">
            <button
              className="btn btn-light col-2"
              onClick={this.handleToggleNewInstrumentForm}
            >
              {currentlyVisibleState.buttonText}
            </button>
          </div>
          {currentlyVisibleState.component}
        </div>
      </React.Fragment>
    );
  }
}

InstrumentsControl.propTypes = {
  masterInstrumentList: PropTypes.object
};

const mapStateToProps = state => {
  return {
    masterInstrumentList: state
  }
}

InstrumentsControl = connect(mapStateToProps)(InstrumentsControl);

export default InstrumentsControl;
