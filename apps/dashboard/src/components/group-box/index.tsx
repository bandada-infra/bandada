import { Grid, GridItem } from "@chakra-ui/react"
import { Group } from "src/types/groups"
import GroupCard from "./group-card"

interface GroupList {
    groupList: Array<Group>
}

export default function GroupBox({ groupList }: GroupList): JSX.Element {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={10} p="20px">
            {groupList.map((group) => (
                <GridItem w="100%" border="1px">
                    <GroupCard {...group} />
                </GridItem>
            ))}
        </Grid>
    )
}
