import React from 'react'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import WindGL from '../tools/webgl-wind/wind-gl1'
import './Main.scss'

mapboxgl.accessToken = 'pk.eyJ1Ijoid29uZ2VyaWMiLCJhIjoiY2pvZHJxbzkyMDZ0azNrcnNiZ2dpcWNlZCJ9.CSD8KH_tNgseSTyf54Yqbw'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myMap: ''
    }
    this.windFiles = {
      0: '2016112000',
      6: '2016112006',
      12: '2016112012',
      18: '2016112018',
      24: '2016112100',
      30: '2016112106',
      36: '2016112112',
      42: '2016112118',
      48: '2016112200'
    }
    this.wind = null
  }

  componentDidMount () {
    this.setState(
      {
        myMap: new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [118, 32],
          zoom: 6
        })
      },
      () => {
        this.state.myMap.on('click', function (event) {
          console.log(event.lngLat)
        })
      }
    )
    let canvas = document.createElement('canvas')
    canvas.id = 'mapcanvas'
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    let gl = canvas.getContext('webgl', { antialiasing: false })
    this.wind = (window.wind = new WindGL(gl))
    console.log(this.wind)
  }

  drawPoint () {
    this.state.myMap.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [118, 32]
              },
              properties: {
                title: 'Mapbox DC',
                icon: 'monument'
              }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [118, 33]
              },
              properties: {
                title: 'Mapbox SF',
                icon: 'harbor'
              }
            }
          ]
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'text-field': '{title}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0],
        'text-anchor': 'top'
      }
    })
  }

  drawLine () {
    this.state.myMap.addLayer({
      id: ';line',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [[119, 32], [120, 32], [120, 33], [119, 33]]
              }
            }
          ]
        }
      },
      type: 'line',
      paint: {
        'line-color': '#FF4500',
        'line-width': 8
      }
    })
  }

  drawPolygonNO () {
    this.state.myMap.addLayer({
      id: 'PolygonNO',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[[121, 32], [122, 32], [122, 33], [121, 33], [121, 32]]]
              }
            }
          ]
        }
      },
      type: 'fill',
      paint: {
        'fill-color': '#FF4500'
      }
    })
  }

  drawPolygonYES () {
    this.state.myMap.addLayer({
      id: 'PolygonYES',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [[123, 32], [124, 32], [124, 33], [123, 33], [123, 32]],
                  [[123.2, 32.2], [123.8, 32.2], [123.8, 32.8], [123.2, 32.8], [123.2, 32.2]]
                ]
              }
            }
          ]
        }
      },
      type: 'fill',
      paint: {
        'fill-color': '#FF4500'
      }
    })
  }

  frame () {
    if (this.wind.windData) {
      this.wind.draw()
    }
    window.requestAnimationFrame(this.frame)
  }

  updateWind (name) {
    let _this = this
    axios.get('/static/data/' + this.windFiles[name] + '.json').then(windData => {
      const windImage = new Image()
      windData.image = windImage
      windImage.src = '/static/data/' + this.windFiles[name] + '.png'
      windImage.onload = function () {
        _this.wind.setWind(windData)
      }

      _this.state.myMap.addSource('mapdata', {
        type: 'canvas',
        canvas: 'mapcanvas',
        animate: true,
        coordinates: [[118, 32], [119, 32], [119, 31], [118, 31]]
      })
      _this.state.myMap.addLayer({
        id: 'mapdata',
        type: 'raster',
        source: 'mapdata'
      })
    })
  }

  testDraw () {
    this.frame()
    this.updateWind(0)
  }

  render () {
    return (
      <div>
        <div id="mybtn">
          <button id="point" onClick={this.drawPoint.bind(this)}>
						画点
          </button>
          <button id="point" onClick={this.drawLine.bind(this)}>
						画线
          </button>
          <button id="point" onClick={this.drawPolygonNO.bind(this)}>
						画面（无洞）
          </button>
          <button id="point" onClick={this.drawPolygonYES.bind(this)}>
						画面（有洞）
          </button>
					`{' '}
          <button id="point" onClick={this.testDraw.bind(this)}>
						测试
          </button>
        </div>
        <div id="map" />
      </div>
    )
  }
}
