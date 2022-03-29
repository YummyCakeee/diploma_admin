import React, { useState } from "react"
import { StyleSheet, Text, ScrollView } from "react-native"
import PageTemplate from "components/PageTemplate/Pagetemplate"
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
        'https://findesk.ru/upload/iblock/f24/f24e4df794f2f4f9c14646d0ef6d1853.png',
        'https://phonoteka.org/uploads/posts/2021-05/1620291711_61-phonoteka_org-p-barbershop-fon-62.jpg',
        'https://avatars.mds.yandex.net/get-altay/2134557/2a0000016cde3b1c431082f2d91e8a6b5fc2/XXL',
        'https://mykaleidoscope.ru/uploads/posts/2020-02/1581707138_22-p-sbori-zhenikhov-v-barbershope-58.jpg',
    ])
    return (
        <PageTemplate style={styles.container}>
            <ScrollView>
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
            </ScrollView>
        </PageTemplate>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }

})

export default HomeContainer