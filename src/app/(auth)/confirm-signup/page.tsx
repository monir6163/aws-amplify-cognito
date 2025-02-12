import EmailVerify from "@/components/auth/emailVerify";

export default function page() {
  return (
    <section className="flex justify-center h-screen">
      <div className="max-w-xl w-full m-auto my-10 space-y-10">
        <EmailVerify />
      </div>
    </section>
  );
}
