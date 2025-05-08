import { useState, useEffect } from 'react';
import { Image, Modal, Pressable, StyleSheet, View, ImageProps, Text } from 'react-native';

interface ZoomableImageProps extends Omit<ImageProps, 'source'> {
    source: ImageProps['source'];
    thumbnailStyle?: ImageProps['style'];
    modalImageStyle?: ImageProps['style'];
}

export default function ZoomableImage({ source, thumbnailStyle, modalImageStyle, ...rest }: ZoomableImageProps) {
    const [visible, setVisible] = useState(false);
    const [instructions, setInstructions] = useState(false);

    useEffect(() => {
        setInstructions(true);
        const timer = setTimeout(() => {
            setInstructions(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View className="relative h-[200px]">
            <Pressable
                style={[{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }]}
                onPress={() => setVisible(true)}
            >
                {instructions && (
                    <View className="absolute inset-0 bg-black/50 z-20 w-full justify-center items-center">
                        <Text className="text-white text-xl">
                            Toca para ampliar la imagen
                        </Text>
                    </View>
                )}
                <Image
                    source={source}
                    style={thumbnailStyle}
                    {...rest}
                />
            </Pressable>


            <Modal
                visible={visible}
                transparent
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.modalBackground}
                    onPress={() => setVisible(false)}
                >
                    <Image
                        source={source}
                        style={[styles.fullscreenImage, modalImageStyle]}
                        resizeMode="contain"
                    />
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
});
