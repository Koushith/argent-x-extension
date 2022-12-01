/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Alert,
  BarBackButton,
  CellStack,
  Input,
  NavigationContainer,
  useToast,
} from "@argent/ui"
import { Select, VStack } from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

import { Button, ButtonTransparent } from "../../components/Button"
import { AddRoundedIcon } from "../../components/Icons/MuiIcons"
import { EditRoundedIcon } from "../../components/Icons/MuiIcons"
import { StyledControlledSelect } from "../../components/InputSelect"
import { PageWrapper } from "../../components/Page"
import Row, { RowCentered } from "../../components/Row"

const IconWrapper = styled(RowCentered)`
  height: 64px;
  width: 64px;

  background-color: ${({ theme }) => theme.bg2};
  border-radius: 100px;
`

const ContactAvatar = styled.img`
  border-radius: 100px;
  height: 64px;
  width: 64px;
`

const StyledAddIcon = styled(AddRoundedIcon)`
  font-size: 36px;
  fill: ${({ theme }) => theme.text2};
`

const StyledEditIcon = styled(EditRoundedIcon)`
  font-size: 36px;
  fill: ${({ theme }) => theme.text2};
`

const StyledContactForm = styled.form<{ formHeight?: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  height: ${({ formHeight }) => (formHeight ? formHeight : "62vh")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`

export const BeneficiaryBackup: FC<any> = ({
  networkDisabled,
  onSave,
  onCancel,
  formHeight,
  recipientAddress,
  ...props
}) => {
  const { contactId } = useParams<{ contactId?: string }>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [claimType, setClaimType] = useState("")
  const [DDayDate, setDdayDate] = useState("")
  const [loader, setLoader] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const saveHandler = () => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false)
      toast({
        title: "Recovery method created Successfully.",
        description: "Recovery method created Successfully  .",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }, 3000)
  }

  const claimOptions = [
    { label: "DDay", value: "DDay" },
    { label: "Signalling", value: "Signalling" },
  ]

  return (
    <NavigationContainer
      leftButton={<BarBackButton onClick={() => navigate(-1)} />}
      title={"Create Recovery"}
    >
      <StyledContactForm>
        <PageWrapper>
          <CellStack p="0">
            <div>
              <Input
                name="name"
                placeholder="Account Address"
                autoComplete="off"
                autoFocus
                type="text"
                spellCheck={false}
              />
            </div>

            <div>
              <Select
                placeholder="Select Claim Type"
                mt={4}
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
              >
                <option value="DDay">DDay</option>
                <option value="Signalling">Signalling</option>
              </Select>
            </div>

            {claimType === "DDay" && (
              <>
                <p>
                  <Input
                    type="date"
                    value={DDayDate}
                    onChange={(e) => setDdayDate(e.target.value)}
                  />
                </p>
                {DDayDate && (
                  <Alert
                    mt={4}
                    description={`Beneficiary will get access to this account on ${DDayDate}`}
                  />
                )}
              </>
            )}
            {claimType === "Signalling" && <p>Signalling</p>}
          </CellStack>
        </PageWrapper>
      </StyledContactForm>
      <VStack {...props} p={4}>
        <Row gap="12px">
          <Button type="button" onClick={() => undefined}>
            Cancel
          </Button>
          <Button onClick={saveHandler} variant="primary">
            {loader ? "Saving..." : "Save"}
          </Button>
        </Row>
      </VStack>
    </NavigationContainer>
  )
}
