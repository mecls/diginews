// Divider.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type Props = {
    color?: string;
    thickness?: number;
    marginVertical?: number;
    style?: ViewStyle;
};

const Divider: React.FC<Props> = ({
    color = '#1a1a3b',        // match your nav color
    thickness = StyleSheet.hairlineWidth,
    marginVertical = 4,
    style,
}) => {
    return (
        <View
            style={[
                styles.divider,
                {
                    borderBottomColor: color,
                    borderBottomWidth: thickness,
                    marginVertical,
                    width: '200%',
                    alignSelf: 'center',
                    marginTop: 8,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    divider: {
        alignSelf: 'stretch',
    },
});

export default Divider;
