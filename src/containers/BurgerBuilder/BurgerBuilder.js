import React, {Component} from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component{
    state = {
        showModal: false
    };
    
    componentDidMount(){
       this.props.onInitIngredients();
    }

    orderNowClickHandler = () => {
        this.setState({showModal: true});
    }

    updatePurchasable(){
        const ingredients = {...this.props.ingredients};
        const sum = Object.keys(ingredients).map((igkey) => {
            return ingredients[igkey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    removeBackdropHandler = () =>{
        this.setState({showModal: false});
    }

    purchaseContinueHandler = () => {
        //alert("You can continue!");
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {...this.props.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let burger = this.props.error ? <p>Ingredients cannot be loaded</p> : <Spinner />;
        let orderSummary = null;
        if(this.props.ingredients) {
            burger = (
                <React.Fragment>
                    <Burger ingredients={this.props.ingredients} />
                    <BuildControls ingredientAdded={this.props.onIngredientAdded} ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo} price={this.props.totalPrice} purchasable={this.updatePurchasable()} 
                        ordered={this.orderNowClickHandler}
                    />
                </React.Fragment>
            );
            orderSummary = (<OrderSummary 
                ingredients={this.props.ingredients}
                totalPrice = {this.props.totalPrice}
                purchaseCancelled={this.removeBackdropHandler}
                purchaseContinued={this.purchaseContinueHandler}
                />
            );
        }
        return (
            <React.Fragment>
                <Modal show={this.state.showModal} modalClosed={this.removeBackdropHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));