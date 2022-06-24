import React, {Component} from "react";
import {ScrollView, ImageBackground, View, Text, Dimensions, Image, TextInput} from "react-native";
import DailyWeather from "./src/screens/DailyWeather";
import TodayWeather from "./src/screens/TodayWeather";
import {API_KEY} from "./config";
import bgImg from "./src/assets/bgImage.jpg";

const deviceWidth = Dimensions.get('window').width;

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postalCode: '10001',
            lat: 43.6532,
            long: -79.3832,
            weather: {}
        }

        this.controller = new AbortController();
        this.signal = this.controller.signal;
    }

    async componentDidMount(){
        await this.getLatLong();
    };

    getLatLong = () => {

        let url = `https://api.openweathermap.org/data/2.5/weather?zip=${this.state.postalCode}&appid=${API_KEY}`
        fetch(url)
            .then(async (res) => await res.json() )
            .then((data) => {
                console.log('response ==> ', JSON.stringify(data))
                let coord = data && data.coord && data.coord;
                if (coord) {
                    this._fetchWeather(coord.lat, coord.lon)
                }
            }).catch(e => {
            console.log('error => ', e.message)
        });
    };

    _fetchWeather = (lat, long) => {
        let signal = this.signal;
        //   const { lat, long } = this.state;

        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;
        console.log(url)
        // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`, { signal })
        fetch(url, { signal })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ weather: data })
            })
            .catch((err) => {
                console.log("error", err);
            });
        return () => this.controller.abort();
    };

    render() {

        const { weather } = this.state;

        console.log(weather)

        return <View style={{ flex: 1, backgroundColor: 'dodgerblue' }}>
            <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
                <View style={{ width: "100%", height: "100%" , position: 'absolute', backgroundColor: '#00000080', paddingTop: 40 }} />

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 35
                }}>
                    <TextInput style={{ height: 50, margin: 12, backgroundColor: 'white', padding: 15, borderRadius: 10, width: '95%', maxWidth: 700 }}
                               value={this.state.postalCode}
                               placeholder={"Enter Postal Code"}
                               onSubmitEditing={() => this.getLatLong()}
                               onChangeText={(postalCode) => this.setState({ postalCode }) }
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{  }} style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                        <Text
                            style={{
                                color: 'white',
                                marginTop: 10,
                                fontSize: 15
                            }}
                        >{weather.timezone}</Text>

                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                {weather.current && (
                                    <Image style={{width: 50, height: 50}}
                                           source={{
                                               uri: `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
                                           }}
                                           resizeMode={"contain"}
                                    />
                                )}
                                <Text style={{
                                    color: 'white',
                                    justifyContent: 'center',
                                    marginTop: 10,
                                    fontSize: 60
                                }}>{Math.round(weather.current && weather.current.temp)}°C</Text>
                            </View>
                            <Text style={{
                                color: 'white',
                                fontSize: 15,
                                textTransform: 'capitalize'
                            }}>
                                {weather.current &&
                                weather.current.weather[0].description}
                            </Text>
                        </View>

                        <TodayWeather currentWeather={weather} timezone={weather.timezone} />
                        <DailyWeather data={weather.daily} todayWeather={weather} />
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    }

}