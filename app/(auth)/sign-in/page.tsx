import {FORM_TYPES} from "@/lib/utils";
import {FormAuth} from "@/components/FormAuth";

function PageSignIn() {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <FormAuth type={FORM_TYPES.SIGN_IN} />
    </section>
  );
}

export default PageSignIn;
