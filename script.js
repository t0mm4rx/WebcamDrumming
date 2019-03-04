let capture

let pad_size = 80

const detected_color = [100, 200, 100]
const undetected_color = [230, 100, 100]

let drag = null

let pads = [
  {
    name: "kick.wav",
    label: "Kick",
    x: 380,
    y: 260,
    threeshold: 120,
    sound: null,
    triggered: false
  },
  {
    name: "snare.wav",
    label: "Snare",
    x: 100,
    y: 260,
    threeshold: 120,
    sound: null,
    triggered: false
  },
  {
    name: "open_hat.wav",
    label: "Open HiHat",
    x: 380,
    y: 60,
    threeshold: 120,
    sound: null,
    triggered: false
  },
  {
    name: "hat.wav",
    label: "Closed HiHat",
    x: 240,
    y: 60,
    threeshold: 120,
    sound: null,
    triggered: false
  },
  {
    name: "symbal.wav",
    label: "Symbal",
    x: 100,
    y: 60,
    threeshold: 120,
    sound: null,
    triggered: false
  }
]

function preload()
{
  for (var pad of pads)
  {
    pad.sound = loadSound(pad.name)
  }
}

function setup()
{
  createCanvas(480, 320).parent('canvas_wrapper')

  capture = createCapture(VIDEO)
  capture.size(240, 160)
  capture.hide()

  pixelDensity(1)
}

function draw()
{

    push()

    translate(width / 2, height / 2)
    scale(-1, 1)
    translate(-width / 2, -height / 2)

    image(capture, 0, 0, 480, 320)

    loadPixels()

    strokeWeight(5)

    rectMode(CENTER)

    for (var pad of pads)
    {
      fill(0, 0, 0, 0)
      if (pad.triggered)
      {
        stroke(detected_color)
      } else
      {
        stroke(undetected_color)
      }
      rect(pad.x, pad.y, pad_size, pad_size)

      noStroke()
      fill(255)

    }

    if (!mouseIsPressed)
    {
      drag = null
    }

    if (drag != null)
    {
      var x = get_mouse_pos()[0]
      var y = get_mouse_pos()[1]

      get_pad(drag).x = x
      get_pad(drag).y = y
    }


    for (var pad of pads)
    {
      if (get_pad_grayscale(pad) > pad.threeshold)
      {
        toggle_pad(pad)
      } else {
        pad.triggered = false
      }
    }

    // debug
    // var pixels_d = get_pixel_area(pad.x - Math.floor(pad_size / 2), pad.y - Math.floor(pad_size / 2), pad_size, pad_size)
    // draw_pixel_array(pixels_d)

    pop()

}

function mousePressed()
{

  var x = get_mouse_pos()[0]
  var y = get_mouse_pos()[1]
  for (var pad of pads)
  {
    if (x > pad.x - pad_size / 2 && x < pad.x + pad_size / 2 && y > pad.y - pad_size / 2 && y < pad.y + pad_size / 2)
      drag = pad.name
  }

}

function get_mouse_pos()
{
  return [Math.floor(width - mouseX), Math.floor(mouseY)]
}

function mouseReleased()
{
  drag = 0
}

function get_pixel_area(x, y, w, h)
{
  let res = []

  for (var i = 0; i < h; i += 1)
  {
    for (var j = 0; j < w; j += 1)
    {
      res.push(get_pixel(x + j, y + i))
    }

  }
  return res

}

function get_pixel(x, y)
{

  let index = ((width - x) + y * width) * 4
  // return ((pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3)
  return ((pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3)

}

function get_grayscale(array)
{
  let s = 0
  for (var a of array)
  {
    s += a
  }
  return s / array.length
}

function get_pad(name)
{
  for (var pad of pads)
  {
    if (pad.name == name)
      return pad
  }
  return null
}

function get_pad_grayscale(pad)
{
  return get_grayscale(get_pixel_area(pad.x - Math.floor(pad_size / 2), pad.y - Math.floor(pad_size / 2), pad_size, pad_size))
}

function toggle_pad(pad)
{

  if (!pad.triggered)
  {
    pad.triggered = true
    pad.sound.play()
  }

}

function draw_pixel_array(pixels_d)
{
  noStroke()
  for (var i = 0; i < pixels_d.length; i++)
  {
    fill(pixels_d[i])
    rect(i % pad_size, Math.floor(i / pad_size), 1, 1)
  }
}
