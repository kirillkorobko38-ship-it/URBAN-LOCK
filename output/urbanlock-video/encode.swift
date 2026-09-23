import Foundation
import AVFoundation
import AppKit

let root = CommandLine.arguments[1]
let out = URL(fileURLWithPath: root + "/urbanlock-before-after.mp4")
let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: 720, AVVideoHeightKey: 1280, AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 5500000]])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: 720, kCVPixelBufferHeightKey as String: 1280, kCVPixelBufferCGImageCompatibilityKey as String: true, kCVPixelBufferCGBitmapContextCompatibilityKey as String: true])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
for i in 0..<480 {
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.003) }
    try autoreleasepool {
        let url = URL(fileURLWithPath: root + String(format: "/frames/%04d.jpg", i))
        let data = try Data(contentsOf: url)
        let source = CGImageSourceCreateWithData(data as CFData, nil)!
        let cg = CGImageSourceCreateImageAtIndex(source, 0, nil)!
        var pixel: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pixel)
        let p = pixel!
        CVPixelBufferLockBaseAddress(p, [])
        let ctx = CGContext(data: CVPixelBufferGetBaseAddress(p), width: 720, height: 1280, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(p), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
        ctx.draw(cg, in: CGRect(x: 0, y: 0, width: 720, height: 1280))
        CVPixelBufferUnlockBaseAddress(p, [])
        if !adaptor.append(p, withPresentationTime: CMTime(value: Int64(i), timescale: 24)) { fatalError("Frame failed: \(String(describing: writer.error))") }
    }
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print("Export status: \(writer.status.rawValue), \(String(describing: writer.error))")
let asset = AVURLAsset(url: out)
print("Duration: \(CMTimeGetSeconds(asset.duration)); video tracks: \(asset.tracks(withMediaType: .video).count)")
