# Shopping cart with Express and React (not implemented yet!)

Available REST API routes:
  * Product:
    - **GET** ***/product/list*** to get all items
    - **POST** ***/product/generate*** to generate items
    - **POST** ***/product/create*** to create an item
    - **DELETE** ***/product/delete/:productId*** to delete an item
    - **GET** ***/product/get/:productId*** to get an item

  * Cart:
    - **GET** ***/cart/list*** to get cart list items
    - **DELETE** ***/cart/clear*** to clear the entire cart data
    - **POST** ***/cart/add/:productId*** to add certain product to the cart
    - **DELETE** ***/cart/delete/:productId*** to remove certain product from the cart
    - **POST** ***/cart/applyCoupon/:couponCode*** to apply the coupon discount to the cart

  * Coupon:
    - **GET** ***/coupon/list*** to get list of all coupon
    - **POST** ***/coupon/generate*** to generate coupon
    - **POST** ***/coupon/create*** to create an item
    - **DELETE** ***/coupon/delete/:couponId*** to delete an item
    - **GET** ***/coupon/get/:couponId*** to get an item
