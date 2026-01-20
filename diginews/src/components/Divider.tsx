// Divider.tsx
import React from 'react'
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

type Props = {
    color?: string
    thickness?: number
    marginVertical?: number
    style?: ViewStyle
}

const Divider: React.FC<Props> = ({
    color = '#1a1a3b',
    thickness = StyleSheet.hairlineWidth,
    marginVertical = 4,
    style,
}) => {
    return (
        <View
            style={[
                styles.divider,
                {
                    width: SCREEN_WIDTH,
                    borderBottomColor: color,
                    borderBottomWidth: thickness,
                    marginVertical,
                },
                style,
            ]}
        />
    )
}

const styles = StyleSheet.create({
    divider: {
        alignSelf: 'center',
    },
})

export default Divider
