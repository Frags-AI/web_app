import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import React from 'react';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

// const InjectedCheckoutForm = () => (
//   <ElementsConsumer>
//     {({ stripe, elements }) => (
//       <CheckoutForm />
//     )}
//   </ElementsConsumer>
// );

export default CheckoutForm;
