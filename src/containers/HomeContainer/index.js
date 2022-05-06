import React, { useState } from "react"
import { StyleSheet, Text } from "react-native"
import ScreenTemplate from "components/ScreenTemplate/ScreenTemplate"
import globalStyles from "global/styles/styles"
import BannerSlider from "components/BannerSlider/BannerSlider"
import BannerImage from "components/Elements/BannerImage/BannerImage"
import SignUpForServices from "components/Elements/SignUpForServices/SignUpForServices"
import OurServices from "components/OurServices/OurServices"
import HomeSection from "./HomeSection"

const HomeContainer = () => {
    const [images, setImages] = useState([
        'https://mglb.ru/upload/iblock/346/f0e39337_6c1b_41d5_952a_339ba54ebd7c.jpg',
        'https://avatars.mds.yandex.net/get-altay/1583511/2a0000016bf53c3d2af0e9cdc93e1e417eab/XXL',
        'https://burobiz-a.akamaihd.net/uploads/images/38059/large_17d7306e264ac2fed78642a2784e73f4.jpg',
        'https://phonoteka.org/uploads/posts/2021-05/1620291711_61-phonoteka_org-p-barbershop-fon-62.jpg',
        'https://avatars.mds.yandex.net/get-altay/2134557/2a0000016cde3b1c431082f2d91e8a6b5fc2/XXL',
        'https://mykaleidoscope.ru/uploads/posts/2020-02/1581707138_22-p-sbori-zhenikhov-v-barbershope-58.jpg',
    ])
    return (
        <ScreenTemplate>
                <Text style={globalStyles.page_title}>Главная</Text>
                <BannerSlider
                    autoSlide
                    items={images.map(el => (
                        <BannerImage
                            source={el}
                        />
                    ))}
                />
                <HomeSection>
                    <SignUpForServices />
                </HomeSection>
                <HomeSection>
                    <OurServices />
                </HomeSection>
                <BannerSlider
                    autoSlide
                    items={images.map(el => (
                        <BannerImage
                            source={el}
                        />
                    ))}
                />
        </ScreenTemplate>
    )
}

const styles = StyleSheet.create({

})

export default HomeContainer