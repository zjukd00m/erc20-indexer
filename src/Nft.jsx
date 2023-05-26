import { Box, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

export default function Nft({
    modalOpen,
    onClose,
    token,
}) {
    console.log(token)
    return (
        <Box alignContent="center" justifyContent="center" display="flex">
            <Modal isOpen={modalOpen} onClose={onClose}>
                <ModalOverlay  />
                <ModalContent >
                    <ModalHeader> { token.metadata.title }
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Image 
                            src={token.metadata.rawMetadata.image} 
                            alt={token.metadata.title} 
                            height={400}
                            width={400}
                        />
                        <Flex direction="column">
                            <Text> Collection: <span> { token.metadata.contract.name } </span> </Text>
                            <Text> Total Supply: <span> { token.metadata.contract.totalSupply } </span> </Text>
                            <Text> Name: <span> { token.metadata.title } </span> </Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}