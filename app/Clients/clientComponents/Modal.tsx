import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useCreateClient } from "../clientHooks/hook";
import { toast } from "react-toastify";

interface CreateClientModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  refetch: () => void;
}

interface errorInterface {
  email: string,
  name: string,
  [key: string]: string
}

export default function CreateClientModal({ isOpen, onOpen, onOpenChange, refetch }: CreateClientModalProps) {
  const { mutateAsync: createClient } = useCreateClient();
  const [errors, setErrors] = useState<errorInterface | undefined>();
  const [submitted, setSubmitted] = useState<any>(null);

  const phoneRegex = /^\+1-\d{3}-\d{3}-\d{4}$/;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const clientObject = {
      email: data.email as string,
      name: data.name as string,
      lastName: data.lastName as string,
      documentId: data.documentId as string,
      phone: data.phone as string,
      address: data.address as string,
    };

    createClient(clientObject).then(() => {
      toast.success("Client created successfully");
      onOpenChange(false);
      refetch();
    }).catch((err) => {
      toast.error("Error client already exists");
    });
    setSubmitted(true);

  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Client</ModalHeader>
              <ModalBody>
                <Form
                  className="w-full justify-center items-center space-y-4"
                  validationErrors={errors}
                  onReset={() => setSubmitted(null)}
                  onSubmit={onSubmit}
                >
                  <div className="flex flex-col gap-4 items-center max-w-md w-full">
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter your email";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid email address";
                        }
                      }}
                      label="Email"
                      labelPlacement="outside"
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the client name";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid name";
                        }
                      }}
                      label="Name"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Enter the client name"
                      type="text"
                    />
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the client's last name";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid last name";
                        }
                      }}
                      label="Last Name"
                      labelPlacement="outside"
                      name="lastName"
                      placeholder="Enter the client's last name"
                      type="text"
                    />
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the document ID";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid document ID";
                        }
                      }}
                      label="Document ID"
                      labelPlacement="outside"
                      name="documentId"
                      placeholder="Enter the document ID"
                      type="text"
                    />
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the phone number";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid phone number";
                        }
                        if (validationDetails.patternMismatch) {
                          return "Phone number must be in the format +1-809-279-5464";
                        }
                      }}
                      label="Phone"
                      labelPlacement="outside"
                      name="phone"
                      placeholder="Enter the phone number"
                      type="tel"
                      pattern={phoneRegex.source}
                    />
                    <Input
                      isRequired
                      errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                          return "Please enter the address";
                        }
                        if (validationDetails.typeMismatch) {
                          return "Please enter a valid address";
                        }
                      }}
                      label="Address"
                      labelPlacement="outside"
                      name="address"
                      placeholder="Enter the address"
                      type="text"
                    />
                    {errors?.terms && <span className="text-danger text-small">{errors?.terms}</span>}
                  </div>

                  <ModalFooter className="flex gap-4 w-full px-[-24px]">
                    <Button className="w-full" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button type="reset" variant="bordered">
                      Reset
                    </Button>
                  </ModalFooter>

                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
