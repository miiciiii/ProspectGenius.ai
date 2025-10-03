export default function StripeSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
        <p>Your payment has been processed. Thank you!</p>
      </div>
    </div>
  );
}
