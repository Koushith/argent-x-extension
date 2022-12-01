/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  Alert,
  AlertButton,
  BarCloseButton,
  CellStack,
  Input,
  NavigationContainer,
  useToast,
} from "@argent/ui"
import { VStack } from "@chakra-ui/react"
import { Checkbox } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../../components/Button"
import Row from "../../components/Row"
import { SupportFooter } from "../settings/SupportFooter"

export const RecoverScreen = () => {
  const [loader, setLoader] = useState(false)
  const [active, setActive] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const saveHandler = () => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false)
      toast({
        title: "Account Recovered Successfully.",
        description: "Account Recovered Successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }, 3000)
  }
  return (
    <>
      <NavigationContainer
        rightButton={<BarCloseButton onClick={() => navigate(-1)} />}
        title={"Recover Account"}
      ></NavigationContainer>
      <CellStack>
        <AlertButton
          colorScheme={active ? "skyBlue" : "success"}
          title="0x0640e3ca454c4097F17d0f8226e2a82f61b223741a59FC877F43840a0736291A"
          description="This Account is ready to be recovered"
          size="lg"
          onClick={() => {
            setActive(!active)
          }}
        ></AlertButton>

        <VStack p="0" mt={4}>
          <Row gap="12px">
            <Button type="button" onClick={() => undefined}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveHandler}>
              {loader ? " Recovering..." : "Recover"}
            </Button>
          </Row>
        </VStack>
        <SupportFooter />
      </CellStack>
    </>
  )
}
