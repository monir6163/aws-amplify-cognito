import ForgotPassword from "@/components/auth/forgot";

export default function page() {
  return (
    <section className="flex justify-center h-screen">
      <div className="max-w-xl w-full m-auto my-10 space-y-10">
        <ForgotPassword />
      </div>
    </section>
  );
}
