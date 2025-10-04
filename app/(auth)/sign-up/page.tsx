import {FORM_TYPES} from "@/lib/utils";
import {FormAuth} from "@/components/FormAuth";

function PageSignUp() {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <FormAuth type={FORM_TYPES.SIGN_UP} />
    </section>
  );
}

export default PageSignUp;
