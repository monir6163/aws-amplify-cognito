import SignUp from "@/components/auth/signUp";

export default function page() {
  return (
    <section className="flex justify-center h-screen">
      <div className="max-w-xl w-full m-auto my-10 space-y-10">
        <SignUp />
      </div>
    </section>
  );
}
