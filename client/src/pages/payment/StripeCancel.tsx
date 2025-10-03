export default function StripeCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Payment Canceled</h1>
        <p>Your checkout was canceled. Please try again if you wish to continue.</p>
      </div>
    </div>
  );
}
