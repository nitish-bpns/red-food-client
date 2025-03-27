import { addItemToCartBackend, addNewItem, addSameItem, removeItem, removeItemFromCartBackend } from "../provider/redux/slices/cartSlice";

export const updateCart = (item, quantity, dispatch, cart) => {
  const isAlreadyAdded = cart.items.some(
    (cartItem) => cartItem.menu._id === item._id
  );

  if (isAlreadyAdded) {
    if (quantity > 0) {
      dispatch(addSameItem({ menuId: item._id, price: item.price }));
      dispatch(addItemToCartBackend({ menuId: item._id, price: item.price }));
    } else if (quantity < 0) {
      dispatch(removeItem({ menuId: item._id, price: item.price }));
      dispatch(removeItemFromCartBackend({ menuId: item._id, price: item.price }));
    }
  } else {
    dispatch(addNewItem({ menu: item, quantity: 1, _id: item._id }));
    dispatch(addItemToCartBackend({ menuId: item._id, price: item.price }));
  }
};
