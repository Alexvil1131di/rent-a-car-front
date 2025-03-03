import { Modal, ModalContent, ModalHeader, ModalBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, ModalFooter, Button } from "@heroui/react";

const ReservationsModal = ({
  isOpen,
  onOpenChange,
  reservations
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  reservations: any[];
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full">
      <ModalContent className="w-full">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Client Reservations
            </ModalHeader>
            <ModalBody>
              <Table aria-label="Reservations table">
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>START DATE</TableColumn>
                  <TableColumn>END DATE</TableColumn>
                  <TableColumn>TOTAL COST</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No reservations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.id}</TableCell>
                        <TableCell>
                          {new Date(reservation.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(reservation.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ${parseFloat(reservation.totalCost).toLocaleString()}
                        </TableCell>
                        <TableCell>{reservation.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReservationsModal;