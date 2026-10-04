"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const COLORS = {
  first: "#2563eb",
  second: "#dc2626",
  factorA: "#16a34a",
  factorB: "#9333ea",
}

// Ejemplos de distributiva
const distribExamples = {
  simple: {
    name: "Binomios simples",
    term1: "x",
    term2: "2",
    term1Sign: "+",
    term2Sign: "+",
    targetA: "x",
    targetB: "3",
    targetASign: "+",
    targetBSign: "+",
    products1: ["x²", "3x"],
    products1Signs: ["+", "+"],
    products2: ["2x", "6"],
    products2Signs: ["+", "+"],
    allTerms: { t1: "x²", t2: "3x", t3: "2x", t4: "6" },
    allSigns: { s1: "", s2: "+", s3: "+", s4: "+" },
    result: "x² + 5x + 6",
    stepDescriptions: [
      "Comenzamos con los dos binomios a multiplicar",
      "Distribuimos x sobre cada término del segundo binomio",
      "Distribuimos 2 sobre cada término del segundo binomio",
      "Tenemos los 4 productos parciales",
      "Agrupamos términos semejantes (3x + 2x = 5x)",
    ],
  },
  coeficiente: {
    name: "Binomio con coeficiente",
    term1: "2x",
    term2: "3",
    term1Sign: "+",
    term2Sign: "+",
    targetA: "x",
    targetB: "4",
    targetASign: "+",
    targetBSign: "+",
    products1: ["2x²", "8x"],
    products1Signs: ["+", "+"],
    products2: ["3x", "12"],
    products2Signs: ["+", "+"],
    allTerms: { t1: "2x²", t2: "8x", t3: "3x", t4: "12" },
    allSigns: { s1: "", s2: "+", s3: "+", s4: "+" },
    result: "2x² + 11x + 12",
    stepDescriptions: [
      "Comenzamos con los dos binomios a multiplicar",
      "Distribuimos 2x sobre cada término del segundo binomio",
      "Distribuimos 3 sobre cada término del segundo binomio",
      "Tenemos los 4 productos parciales",
      "Agrupamos términos semejantes (8x + 3x = 11x)",
    ],
  },
  negativo: {
    name: "Con un negativo",
    term1: "x",
    term2: "3",
    term1Sign: "+",
    term2Sign: "−",
    targetA: "x",
    targetB: "5",
    targetASign: "+",
    targetBSign: "+",
    products1: ["x²", "5x"],
    products1Signs: ["+", "+"],
    products2: ["3x", "15"],
    products2Signs: ["−", "−"],
    allTerms: { t1: "x²", t2: "5x", t3: "3x", t4: "15" },
    allSigns: { s1: "", s2: "+", s3: "−", s4: "−" },
    result: "x² + 2x − 15",
    stepDescriptions: [
      "Comenzamos con los dos binomios a multiplicar",
      "Distribuimos x sobre cada término del segundo binomio",
      "Distribuimos −3 sobre cada término del segundo binomio (atención a los signos)",
      "Tenemos los 4 productos parciales",
      "Agrupamos términos semejantes (5x − 3x = 2x)",
    ],
  },
  dosNegativos: {
    name: "Con dos negativos",
    term1: "x",
    term2: "2",
    term1Sign: "+",
    term2Sign: "−",
    targetA: "x",
    targetB: "4",
    targetASign: "+",
    targetBSign: "−",
    products1: ["x²", "4x"],
    products1Signs: ["+", "−"],
    products2: ["2x", "8"],
    products2Signs: ["−", "+"],
    allTerms: { t1: "x²", t2: "4x", t3: "2x", t4: "8" },
    allSigns: { s1: "", s2: "−", s3: "−", s4: "+" },
    result: "x² − 6x + 8",
    stepDescriptions: [
      "Comenzamos con los dos binomios a multiplicar",
      "Distribuimos x sobre cada término del segundo binomio",
      "Distribuimos −2 sobre cada término del segundo binomio (negativo por negativo = positivo)",
      "Tenemos los 4 productos parciales",
      "Agrupamos términos semejantes (−4x − 2x = −6x)",
    ],
  },
  cuadrado: {
    name: "Cuadrado de binomio",
    term1: "x",
    term2: "2",
    term1Sign: "+",
    term2Sign: "+",
    targetA: "x",
    targetB: "2",
    targetASign: "+",
    targetBSign: "+",
    products1: ["x²", "2x"],
    products1Signs: ["+", "+"],
    products2: ["2x", "4"],
    products2Signs: ["+", "+"],
    allTerms: { t1: "x²", t2: "2x", t3: "2x", t4: "4" },
    allSigns: { s1: "", s2: "+", s3: "+", s4: "+" },
    result: "x² + 4x + 4",
    stepDescriptions: [
      "Elevamos al cuadrado: (x + 2)² = (x + 2)(x + 2)",
      "Distribuimos x sobre cada término del segundo binomio",
      "Distribuimos 2 sobre cada término del segundo binomio",
      "Tenemos los 4 productos parciales",
      "Agrupamos términos semejantes (2x + 2x = 4x). Resultado: x² + 4x + 4",
    ],
  },
  cubo: {
    name: "Cubo de binomio",
    term1: "x² + 4x + 4",
    term2: "",
    term1Sign: "+",
    term2Sign: "+",
    targetA: "x",
    targetB: "2",
    targetASign: "+",
    targetBSign: "+",
    products1: ["x³", "4x²", "4x"],
    products1Signs: ["+", "+", "+"],
    products2: ["2x²", "8x", "8"],
    products2Signs: ["+", "+", "+"],
    allTerms: { t1: "x³", t2: "4x²", t3: "4x", t4: "2x²", t5: "8x", t6: "8" },
    allSigns: { s1: "", s2: "+", s3: "+", s4: "+", s5: "+", s6: "+" },
    result: "x³ + 6x² + 12x + 8",
    isCube: true,
    squareResult: "x² + 4x + 4",
    stepDescriptions: [
      "Para el cubo, primero calculamos el cuadrado: (x + 2)² = x² + 4x + 4",
      "Ahora multiplicamos el resultado por (x + 2)",
      "Distribuimos x sobre cada término del trinomio",
      "Distribuimos 2 sobre cada término del trinomio",
      "Agrupamos: x³ + (4x² + 2x²) + (4x + 8x) + 8 = x³ + 6x² + 12x + 8",
    ],
  },
}

function Distributiva() {
  const [example, setExample] = useState<keyof typeof distribExamples>("simple")
  const [step, setStep] = useState(0)
  const totalSteps = 5
  const containerRef = useRef<HTMLDivElement>(null)
  const term1Ref = useRef<HTMLSpanElement>(null)
  const term2Ref = useRef<HTMLSpanElement>(null)
  const targetARef = useRef<HTMLSpanElement>(null)
  const targetBRef = useRef<HTMLSpanElement>(null)
  const [arrows, setArrows] = useState<{ d: string; color: string }[]>([])

  const ex = distribExamples[example]
  const isCube = 'isCube' in ex && ex.isCube

  useEffect(() => {
    const calculateArrows = () => {
      if (!containerRef.current) return
      const container = containerRef.current.getBoundingClientRect()
      const newArrows: { d: string; color: string }[] = []

      const getPos = (ref: React.RefObject<HTMLSpanElement | null>) => {
        if (!ref.current) return null
        const rect = ref.current.getBoundingClientRect()
        return {
          left: rect.left - container.left,
          right: rect.right - container.left,
          top: rect.top - container.top,
          bottom: rect.bottom - container.top,
          centerX: rect.left + rect.width / 2 - container.left,
          centerY: rect.top + rect.height / 2 - container.top,
        }
      }

      // Para el cubo, mostrar flechas en pasos 2 y 3
      const arrowStep1 = isCube ? 2 : 1
      const arrowStep2 = isCube ? 3 : 2

      // Flechas del primer término (term1) hacia targetA y targetB
      if (step >= arrowStep1) {
        const from = getPos(term1Ref)
        const toA = getPos(targetARef)
        const toB = getPos(targetBRef)
        
        if (from && toA) {
          // Flecha curva por arriba: term1 -> targetA
          const startX = from.right + 2
          const startY = from.centerY - 8
          const endX = toA.left - 2
          const endY = toA.centerY - 8
          const controlY = Math.min(startY, endY) - 25
          newArrows.push({
            d: `M${startX} ${startY} Q${(startX + endX) / 2} ${controlY}, ${endX} ${endY}`,
            color: COLORS.first,
          })
        }
        if (from && toB) {
          // Flecha curva por arriba (más alta): term1 -> targetB
          const startX = from.right + 2
          const startY = from.centerY - 12
          const endX = toB.left - 2
          const endY = toB.centerY - 8
          const controlY = Math.min(startY, endY) - 45
          newArrows.push({
            d: `M${startX} ${startY} Q${(startX + endX) / 2} ${controlY}, ${endX} ${endY}`,
            color: COLORS.first,
          })
        }
      }

      // Flechas del segundo término (term2) hacia targetA y targetB
      if (step >= arrowStep2 && !isCube) {
        const from = getPos(term2Ref)
        const toA = getPos(targetARef)
        const toB = getPos(targetBRef)
        
        if (from && toA) {
          // Flecha curva por abajo: term2 -> targetA
          const startX = from.right + 2
          const startY = from.centerY + 8
          const endX = toA.left - 2
          const endY = toA.centerY + 8
          const controlY = Math.max(startY, endY) + 25
          newArrows.push({
            d: `M${startX} ${startY} Q${(startX + endX) / 2} ${controlY}, ${endX} ${endY}`,
            color: COLORS.second,
          })
        }
        if (from && toB) {
          // Flecha curva por abajo (más baja): term2 -> targetB
          const startX = from.right + 2
          const startY = from.centerY + 12
          const endX = toB.left - 2
          const endY = toB.centerY + 8
          const controlY = Math.max(startY, endY) + 45
          newArrows.push({
            d: `M${startX} ${startY} Q${(startX + endX) / 2} ${controlY}, ${endX} ${endY}`,
            color: COLORS.second,
          })
        }
      }

      // Para el cubo: flechas desde el trinomio hacia x y 2
      if (step >= arrowStep2 && isCube) {
        const from = getPos(term1Ref) // En cubo, term1Ref tiene el trinomio
        const toA = getPos(targetARef)
        const toB = getPos(term2Ref) // En cubo, term2Ref es el "2" del segundo binomio
        
        if (from && toB) {
          // Flecha curva por abajo: trinomio -> 2
          const startX = from.right + 2
          const startY = from.centerY + 10
          const endX = toB.left - 2
          const endY = toB.centerY + 8
          const controlY = Math.max(startY, endY) + 35
          newArrows.push({
            d: `M${startX} ${startY} Q${(startX + endX) / 2} ${controlY}, ${endX} ${endY}`,
            color: COLORS.second,
          })
        }
      }

      setArrows(newArrows)
    }

    calculateArrows()
    window.addEventListener("resize", calculateArrows)
    return () => window.removeEventListener("resize", calculateArrows)
  }, [step, example, isCube])

  // Renderiza los productos parciales con signos correctos
  const renderProducts = (products: string[], signs: string[], color: string, label: string) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap"
    >
      <span className="text-slate-500 text-sm w-28 text-right">De {label}:</span>
      {products.map((prod, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-slate-400">{signs[i] === "−" ? "−" : "+"}</span>}
          <span 
            className="px-3 py-1 rounded-lg font-bold"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {signs[i] === "−" && i === 0 ? "−" : ""}{prod}
          </span>
        </React.Fragment>
      ))}
    </motion.div>
  )

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Multiplicación de binomios</h2>
          <p className="text-sm text-slate-600">Propiedad distributiva paso a paso</p>
        </div>

        {/* Selector de ejemplo */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(distribExamples).map(([key, value]) => (
            <Button
              key={key}
              variant={example === key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setExample(key as keyof typeof distribExamples)
                setStep(0)
              }}
            >
              {value.name}
            </Button>
          ))}
        </div>

        {/* Fórmula general */}
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500 mb-1">Fórmula general</p>
          <p className="text-2xl font-bold font-mono text-center text-slate-800">
            {isCube ? "(a + b)³ = a³ + 3a²b + 3ab² + b³" : "(a + b)(c + d) = ac + ad + bc + bd"}
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative rounded-2xl bg-slate-50 p-6 min-h-[320px] overflow-visible"
        >
          {/* Para el cubo, mostrar el paso del cuadrado primero */}
          {isCube && step === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Para calcular el cubo, primero calculamos el cuadrado:</p>
              <p className="text-2xl font-bold font-mono">(x + 2)² = (x + 2)(x + 2)</p>
            </div>
          )}

          {isCube && step === 1 && 'squareResult' in ex && (
            <div className="text-center py-6 space-y-4">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 inline-block">
                <p className="text-sm text-blue-600 mb-2">Resultado del cuadrado:</p>
                <p className="text-2xl font-bold font-mono text-blue-700">(x + 2)² = {ex.squareResult}</p>
              </div>
              <div className="pt-4">
                <p className="text-slate-600 mb-2">Ahora multiplicamos este resultado por (x + 2):</p>
                <p className="text-xl font-mono font-semibold">
                  <span className="text-blue-600">({ex.squareResult})</span>
                  <span className="text-slate-500"> · </span>
                  <span className="text-green-600">(x + 2)</span>
                </p>
              </div>
            </div>
          )}

          {/* Binomios - mostrar solo cuando no es el paso inicial del cubo */}
          {(!isCube || step >= 2) && (
            <div className="flex justify-center items-center gap-3 py-8 flex-wrap">
              <div className="flex items-center text-2xl md:text-3xl font-bold">
                <span className="text-slate-700">(</span>
                <motion.span
                  ref={term1Ref}
                  animate={{
                    color: step >= (isCube ? 2 : 1) ? COLORS.first : "#334155",
                    scale: step === (isCube ? 2 : 1) ? 1.1 : 1,
                  }}
                  className="font-mono px-2 py-1 rounded-lg"
                  style={{ backgroundColor: step >= (isCube ? 2 : 1) ? `${COLORS.first}15` : "transparent" }}
                >
                  {isCube && 'squareResult' in ex ? ex.squareResult : ex.term1}
                </motion.span>
                {!isCube && ex.term2 && (
                  <>
                    <span className="text-slate-700 mx-1">{ex.term2Sign}</span>
                    <motion.span
                      ref={!isCube ? term2Ref : undefined}
                      animate={{
                        color: step >= 2 ? COLORS.second : "#334155",
                        scale: step === 2 ? 1.1 : 1,
                      }}
                      className="font-mono px-2 py-1 rounded-lg"
                      style={{ backgroundColor: step >= 2 ? `${COLORS.second}15` : "transparent" }}
                    >
                      {ex.term2}
                    </motion.span>
                  </>
                )}
                <span className="text-slate-700">)</span>
              </div>
              
              <div className="flex items-center text-2xl md:text-3xl font-bold">
                <span className="text-slate-700">(</span>
                <motion.span
                  ref={targetARef}
                  animate={{
                    color: step >= (isCube ? 2 : 1) ? COLORS.factorA : "#334155",
                  }}
                  className="font-mono px-2 py-1 rounded-lg"
                  style={{ backgroundColor: step >= (isCube ? 2 : 1) ? `${COLORS.factorA}15` : "transparent" }}
                >
                  {ex.targetA}
                </motion.span>
                <span className="text-slate-700 mx-1">{ex.targetBSign}</span>
                <motion.span
                  ref={isCube ? term2Ref : targetBRef}
                  animate={{
                    color: step >= (isCube ? 3 : 1) ? (isCube ? COLORS.second : COLORS.factorB) : "#334155",
                  }}
                  className="font-mono px-2 py-1 rounded-lg"
                  style={{ backgroundColor: step >= (isCube ? 3 : 1) ? `${isCube ? COLORS.second : COLORS.factorB}15` : "transparent" }}
                >
                  {ex.targetB}
                </motion.span>
                <span className="text-slate-700">)</span>
              </div>
            </div>
          )}

          {/* SVG para flechas */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              {Object.values(COLORS).map((color) => (
                <marker
                  key={color}
                  id={`arrow-${color.replace("#", "")}`}
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L8,3 z" fill={color} />
                </marker>
              ))}
            </defs>
            {arrows.map((arrow, i) => (
              <motion.path
                key={`${example}-${step}-${i}`}
                d={arrow.d}
                fill="none"
                stroke={arrow.color}
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd={`url(#arrow-${arrow.color.replace("#", "")})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.15 }}
              />
            ))}
          </svg>

          {/* Productos parciales */}
          <div className="mt-4 space-y-3">
            <AnimatePresence>
              {step >= (isCube ? 2 : 1) && (
                isCube ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap"
                  >
                    <span className="text-slate-500 text-sm">De x:</span>
                    {ex.products1.map((prod, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-slate-400">+</span>}
                        <span 
                          className="px-2 py-1 rounded-lg font-bold"
                          style={{ backgroundColor: `${COLORS.first}15`, color: COLORS.first }}
                        >
                          {prod}
                        </span>
                      </React.Fragment>
                    ))}
                  </motion.div>
                ) : renderProducts(ex.products1, ex.products1Signs, COLORS.first, ex.term2Sign === "−" ? ex.term1 : ex.term1)
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= (isCube ? 3 : 2) && (
                isCube ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-center gap-2 text-lg font-mono flex-wrap"
                  >
                    <span className="text-slate-500 text-sm">De 2:</span>
                    {ex.products2.map((prod, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-slate-400">+</span>}
                        <span 
                          className="px-2 py-1 rounded-lg font-bold"
                          style={{ backgroundColor: `${COLORS.second}15`, color: COLORS.second }}
                        >
                          {prod}
                        </span>
                      </React.Fragment>
                    ))}
                  </motion.div>
                ) : renderProducts(ex.products2, ex.products2Signs, COLORS.second, ex.term2Sign === "−" ? `−${ex.term2}` : ex.term2)
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= (isCube ? 4 : 3) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 border-t border-slate-200 mt-3"
                >
                  <div className="flex items-center justify-center gap-2 text-xl font-mono flex-wrap">
                    <span className="text-slate-500">=</span>
                    <span style={{ color: COLORS.first }}>{ex.allTerms.t1}</span>
                    <span className="text-slate-400">{ex.allSigns.s2}</span>
                    <motion.span 
                      animate={{ 
                        backgroundColor: step >= (isCube ? 4 : 4) ? "#fef3c7" : "transparent",
                        padding: step >= (isCube ? 4 : 4) ? "2px 8px" : "0px",
                        borderRadius: "6px"
                      }}
                      style={{ color: COLORS.first }}
                    >
                      {ex.allTerms.t2}
                    </motion.span>
                    <span className="text-slate-400">{ex.allSigns.s3}</span>
                    <motion.span 
                      animate={{ 
                        backgroundColor: step >= (isCube ? 4 : 4) ? "#fef3c7" : "transparent",
                        padding: step >= (isCube ? 4 : 4) ? "2px 8px" : "0px",
                        borderRadius: "6px"
                      }}
                      style={{ color: COLORS.second }}
                    >
                      {ex.allTerms.t3}
                    </motion.span>
                    <span className="text-slate-400">{ex.allSigns.s4}</span>
                    <span style={{ color: COLORS.second }}>{ex.allTerms.t4}</span>
                    {isCube && 't5' in ex.allTerms && (
                      <>
                        <span className="text-slate-400">{ex.allSigns.s5}</span>
                        <span style={{ color: COLORS.second }}>{ex.allTerms.t5}</span>
                        <span className="text-slate-400">{ex.allSigns.s6}</span>
                        <span style={{ color: COLORS.second }}>{ex.allTerms.t6}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 pt-2"
                >
                  <span className="text-2xl font-bold text-slate-400">=</span>
                  <span className="text-2xl font-bold font-mono text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                    {ex.result}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${example}-${step}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border p-5 bg-white"
          >
            <p className="text-sm text-slate-500">
              Paso {step + 1} de {totalSteps}
            </p>
            <p className="text-lg mt-1 font-medium">{ex.stepDescriptions[step]}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>
            Anterior
          </Button>
          <Button onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}>
            Siguiente
          </Button>
          <Button variant="secondary" onClick={() => setStep(0)}>
            Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Casos de factorizacion con dos ejemplos cada uno
const factorCases = {
  fcNum: {
    name: "Factor comun numerico",
    formula: "k · a + k · b = k · (a + b)",
    examples: {
      simple: {
        name: "6x + 12",
        expression: ["6x", "+", "12"],
        factorization: "6 · (x + 2)",
        aValue: "6",
        bValue: "-",
        steps: [
          { text: "Identificamos el factor comun numerico: 6 divide a 6 y a 12", highlight: -1, showA: true },
          { text: "Dividimos cada termino por 6: 6x ÷ 6 = x, 12 ÷ 6 = 2", highlight: -1, showA: true },
          { text: "Factorizamos: 6 · (x + 2)", highlight: -1, showA: true },
        ],
      },
      coef: {
        name: "15x² + 10x + 5",
        expression: ["15x²", "+", "10x", "+", "5"],
        factorization: "5 · (3x² + 2x + 1)",
        aValue: "5",
        bValue: "-",
        steps: [
          { text: "Identificamos el factor comun numerico: el maximo comun divisor de 15, 10 y 5 es 5", highlight: -1, showA: true },
          { text: "Dividimos cada termino por 5: 15x² ÷ 5 = 3x², 10x ÷ 5 = 2x, 5 ÷ 5 = 1", highlight: -1, showA: true },
          { text: "Factorizamos: 5 · (3x² + 2x + 1)", highlight: -1, showA: true },
        ],
      },
    },
    colors: [COLORS.factorA, COLORS.factorB],
  },
  fcExp: {
    name: "Factor comun con exponente",
    formula: "xⁿ · a + xⁿ · b = xⁿ · (a + b)",
    examples: {
      simple: {
        name: "x³ + x²",
        expression: ["x³", "+", "x²"],
        factorization: "x² · (x + 1)",
        aValue: "x²",
        bValue: "-",
        steps: [
          { text: "Identificamos el menor exponente de x: el exponente 2 es el menor, entonces x² es comun", highlight: -1, showA: true },
          { text: "Dividimos cada termino por x²: x³ ÷ x² = x, x² ÷ x² = 1", highlight: -1, showA: true },
          { text: "Factorizamos: x² · (x + 1)", highlight: -1, showA: true },
        ],
      },
      coef: {
        name: "x⁴ + x³ + x²",
        expression: ["x⁴", "+", "x³", "+", "x²"],
        factorization: "x² · (x² + x + 1)",
        aValue: "x²",
        bValue: "-",
        steps: [
          { text: "Identificamos el menor exponente de x: el exponente 2 es el menor, entonces x² es comun", highlight: -1, showA: true },
          { text: "Dividimos cada termino por x²: x⁴ ÷ x² = x², x³ ÷ x² = x, x² ÷ x² = 1", highlight: -1, showA: true },
          { text: "Factorizamos: x² · (x² + x + 1)", highlight: -1, showA: true },
        ],
      },
    },
    colors: [COLORS.factorA, COLORS.first],
  },
  fcComb: {
    name: "Factor comun combinado",
    formula: "k · xⁿ · a + k · xⁿ · b + k · xⁿ · c = k · xⁿ · (a + b + c)",
    examples: {
      simple: {
        name: "6x² + 9x + 3",
        expression: ["6x²", "+", "9x", "+", "3"],
        factorization: "3 · (2x² + 3x + 1)",
        aValue: "3",
        bValue: "-",
        steps: [
          { text: "Identificamos el factor comun numerico: el maximo comun divisor de 6, 9 y 3 es 3", highlight: -1, showA: true },
          { text: "Dividimos cada termino por 3: 6x² ÷ 3 = 2x², 9x ÷ 3 = 3x, 3 ÷ 3 = 1", highlight: -1, showA: true },
          { text: "Factorizamos: 3 · (2x² + 3x + 1)", highlight: -1, showA: true },
        ],
      },
      coef: {
        name: "12x³ + 8x² + 4x",
        expression: ["12x³", "+", "8x²", "+", "4x"],
        factorization: "4x · (3x² + 2x + 1)",
        aValue: "4x",
        bValue: "-",
        steps: [
          { text: "Identificamos el factor comun numerico: el maximo comun divisor de 12, 8 y 4 es 4", highlight: -1, showA: true },
          { text: "Identificamos el factor comun con exponente: el menor exponente de x es 1, entonces x es comun", highlight: -1, showA: true },
          { text: "Dividimos cada termino por 4x: 12x³ ÷ 4x = 3x², 8x² ÷ 4x = 2x, 4x ÷ 4x = 1", highlight: -1, showA: true },
          { text: "Factorizamos: 4x · (3x² + 2x + 1)", highlight: -1, showA: true },
        ],
      },
    },
    colors: [COLORS.factorA, COLORS.second],
  },
  diff: {
    name: "Diferencia de cuadrados",
    formula: "a² − b² = (a − b)(a + b)",
    examples: {
      simple: {
        name: "x² − 9",
        expression: ["x²", "−", "9"],
        factorization: "(x − 3)(x + 3)",
        aValue: "x",
        bValue: "3",
        steps: [
          { text: "Identificamos a² = x², entonces a = x", highlight: 0, showA: true },
          { text: "Identificamos b² = 9, entonces b = 3", highlight: 2, showA: true, showB: true },
          { text: "Aplicamos la formula: (a − b)(a + b)", highlight: -1, showA: true, showB: true },
        ],
      },
      coef: {
        name: "4x² − 25",
        expression: ["4x²", "−", "25"],
        factorization: "(2x − 5)(2x + 5)",
        aValue: "2x",
        bValue: "5",
        steps: [
          { text: "Identificamos a² = 4x² = (2x)², entonces a = 2x", highlight: 0, showA: true },
          { text: "Identificamos b² = 25, entonces b = 5", highlight: 2, showA: true, showB: true },
          { text: "Aplicamos la formula: (a − b)(a + b)", highlight: -1, showA: true, showB: true },
        ],
      },
    },
    colors: [COLORS.factorA, COLORS.factorB],
  },
  tcp: {
    name: "Trinomio cuadrado perfecto",
    formula: "a² ± 2ab + b² = (a ± b)²",
    examples: {
      simple: {
        name: "x² + 6x + 9",
        expression: ["x²", "+", "6x", "+", "9"],
        factorization: "(x + 3)²",
        aValue: "x",
        bValue: "3",
        steps: [
          { text: "Identificamos a² = x², entonces a = x", highlight: 0, showA: true },
          { text: "Identificamos b² = 9, entonces b = 3", highlight: 4, showA: true, showB: true },
          { text: "Verificamos: 2ab = 2·x·3 = 6x", highlight: 2, showA: true, showB: true },
          { text: "Aplicamos la formula: (a + b)²", highlight: -1, showA: true, showB: true },
        ],
      },
      coef: {
        name: "9x² − 12x + 4",
        expression: ["9x²", "−", "12x", "+", "4"],
        factorization: "(3x − 2)²",
        aValue: "3x",
        bValue: "2",
        steps: [
          { text: "Identificamos a² = 9x² = (3x)², entonces a = 3x", highlight: 0, showA: true },
          { text: "Identificamos b² = 4, entonces b = 2", highlight: 4, showA: true, showB: true },
          { text: "Verificamos: 2ab = 2·3x·2 = 12x", highlight: 2, showA: true, showB: true },
          { text: "Aplicamos la formula: (a − b)²", highlight: -1, showA: true, showB: true },
        ],
      },
    },
    colors: [COLORS.first, COLORS.second, COLORS.factorA],
  },
  ccp: {
    name: "Cubo perfecto",
    formula: "a³ ± 3a²b + 3ab² ± b³ = (a ± b)³",
    examples: {
      simple: {
        name: "x³ + 6x² + 12x + 8",
        expression: ["x³", "+", "6x²", "+", "12x", "+", "8"],
        factorization: "(x + 2)³",
        aValue: "x",
        bValue: "2",
        steps: [
          { text: "Identificamos a³ = x³, entonces a = x", highlight: 0, showA: true },
          { text: "Identificamos b³ = 8, entonces b = 2", highlight: 6, showA: true, showB: true },
          { text: "Verificamos: 3a²b = 3·x²·2 = 6x²", highlight: 2, showA: true, showB: true },
          { text: "Verificamos: 3ab² = 3·x·4 = 12x", highlight: 4, showA: true, showB: true },
          { text: "Aplicamos la formula: (a + b)³", highlight: -1, showA: true, showB: true },
        ],
      },
      coef: {
        name: "8x³ − 12x² + 6x − 1",
        expression: ["8x³", "−", "12x²", "+", "6x", "−", "1"],
        factorization: "(2x − 1)³",
        aValue: "2x",
        bValue: "1",
        steps: [
          { text: "Identificamos a³ = 8x³ = (2x)³, entonces a = 2x", highlight: 0, showA: true },
          { text: "Identificamos b³ = 1, entonces b = 1", highlight: 6, showA: true, showB: true },
          { text: "Verificamos: 3a²b = 3·4x²·1 = 12x²", highlight: 2, showA: true, showB: true },
          { text: "Verificamos: 3ab² = 3·2x·1 = 6x", highlight: 4, showA: true, showB: true },
          { text: "Aplicamos la formula: (a − b)³", highlight: -1, showA: true, showB: true },
        ],
      },
    },
    colors: [COLORS.factorA, COLORS.factorB, COLORS.first, COLORS.second],
  },
}

function ExpressionTerms({
  expression,
  highlightIndex,
  colors,
}: {
  expression: string[]
  highlightIndex: number
  colors: string[]
}) {
  let colorIdx = 0
  return (
    <div className="flex items-center justify-center gap-1 text-3xl font-bold font-mono flex-wrap">
      {expression.map((term, i) => {
        const isOperator = term === "+" || term === "−"
        const isHighlighted = i === highlightIndex
        const color = !isOperator ? colors[colorIdx++ % colors.length] : undefined

        return (
          <motion.span
            key={i}
            animate={{
              scale: isHighlighted ? 1.2 : 1,
              color: isHighlighted && color ? color : isOperator ? "#334155" : color,
            }}
            transition={{ duration: 0.3 }}
            className={`px-1 ${isHighlighted ? "rounded-lg bg-slate-200" : ""}`}
          >
            {term}
          </motion.span>
        )
      })}
    </div>
  )
}

function Factorizacion() {
  const [selectedCase, setSelectedCase] = useState<keyof typeof factorCases>("diff")
  const [selectedExample, setSelectedExample] = useState<"simple" | "coef">("simple")
  const [step, setStep] = useState(0)
  
  const caseData = factorCases[selectedCase]
  const example = caseData.examples[selectedExample]
  const currentStep = example.steps[step]

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Factorización animada</h2>
          <p className="text-sm text-slate-600">
            Elegí un caso notable y avanzá paso a paso.
          </p>
        </div>

        {/* Selector de caso */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(factorCases).map(([key, value]) => (
            <Button
              key={key}
              variant={selectedCase === key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCase(key as keyof typeof factorCases)
                setSelectedExample("simple")
                setStep(0)
              }}
            >
              {value.name}
            </Button>
          ))}
        </div>

        {/* Selector de ejemplo */}
        <div className="flex gap-2">
          <Button
            variant={selectedExample === "simple" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedExample("simple")
              setStep(0)
            }}
          >
            {caseData.examples.simple.name}
          </Button>
          <Button
            variant={selectedExample === "coef" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedExample("coef")
              setStep(0)
            }}
          >
            {caseData.examples.coef.name}
          </Button>
        </div>

        {/* Fórmula general */}
        <motion.div
          key={selectedCase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4"
        >
          <p className="text-sm font-medium text-slate-500 mb-1">Fórmula general</p>
          <p className="text-2xl font-bold font-mono text-center text-slate-800">
            {caseData.formula}
          </p>
        </motion.div>

        <div className="rounded-2xl bg-slate-50 p-6 min-h-[220px]">
          <p className="text-sm font-medium text-slate-500 mb-4 text-center">Expresión a factorizar</p>
          
          <ExpressionTerms
            expression={example.expression}
            highlightIndex={currentStep.highlight}
            colors={caseData.colors}
          />

          {/* Valores de a y b */}
          <div className="flex justify-center gap-8 mt-6">
            <AnimatePresence>
              {currentStep.showA && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-xl bg-white border-2 px-4 py-2"
                  style={{ borderColor: COLORS.factorA }}
                >
                  <span className="text-sm font-medium text-slate-500">
                    {example.bValue === "-" ? "Factor:" : "a ="}
                  </span>
                  <span className="text-xl font-bold font-mono" style={{ color: COLORS.factorA }}>
                    {example.aValue}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {currentStep.showB && example.bValue !== "-" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-xl bg-white border-2 px-4 py-2"
                  style={{ borderColor: COLORS.factorB }}
                >
                  <span className="text-sm font-medium text-slate-500">b =</span>
                  <span className="text-xl font-bold font-mono" style={{ color: COLORS.factorB }}>
                    {example.bValue}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {step === example.steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-6"
              >
                <span className="text-2xl font-bold text-slate-400">=</span>
                <span className="text-3xl font-bold font-mono ml-3 text-green-600">
                  {example.factorization}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCase}-${selectedExample}-${step}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border p-5 bg-white"
          >
            <p className="text-sm text-slate-500">
              Paso {step + 1} de {example.steps.length}
            </p>
            <p className="text-lg mt-1 font-medium">{currentStep.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))}>
            Anterior
          </Button>
          <Button onClick={() => setStep(Math.min(example.steps.length - 1, step + 1))}>
            Siguiente
          </Button>
          <Button variant="secondary" onClick={() => setStep(0)}>
            Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de superindice para exponentes
function Sup({ children }: { children: React.ReactNode }) {
  return <sup className="text-[0.6em] relative -top-[0.4em]">{children}</sup>
}

// Calcula el MCD de un array de números
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function gcdArray(arr: number[]): number {
  return arr.reduce((a, b) => gcd(a, b))
}

interface Term {
  id: number
  coef: number
  exp: number
}

// Normaliza polinomio: combina términos con mismo exponente y ordena
function normalizePolynomial(terms: { coef: number; exp: number }[]): { coef: number; exp: number }[] {
  const combined = new Map<number, number>()
  for (const t of terms) {
    combined.set(t.exp, (combined.get(t.exp) || 0) + t.coef)
  }
  return Array.from(combined.entries())
    .map(([exp, coef]) => ({ exp, coef }))
    .filter(t => t.coef !== 0)
    .sort((a, b) => b.exp - a.exp)
}

// Verifica si es cuadrado perfecto
function isPerfectSquare(n: number): number | null {
  if (n < 0) return null
  const sqrt = Math.sqrt(n)
  return Number.isInteger(sqrt) ? sqrt : null
}

// Verifica si es cubo perfecto
function isPerfectCube(n: number): number | null {
  const cbrt = Math.cbrt(Math.abs(n))
  if (Number.isInteger(cbrt)) {
    return n >= 0 ? cbrt : -cbrt
  }
  return null
}

interface FactorizationStep {
  description: string
  expression: React.ReactNode
  highlight?: string
}

interface FactorizationResult {
  steps: FactorizationStep[]
  finalResult: React.ReactNode
}

type PracticaMode = "factorizacion" | "distributiva"
type DifficultyLevel = 1 | 2 | 3

interface GeneratedExercise {
  terms: { coef: number; exp: number }[]
  terms2?: { coef: number; exp: number }[]
  description: string
  methods: string[]
  // Respuesta correcta para factorizacion
  correctAnswer?: {
    factorComun?: { numeric: number; exp: number }
    binomio1?: { a: number; b: number; sign: string }
    binomio2?: { a: number; b: number; sign: string }
    squared?: boolean
  }
  // Respuesta correcta para distributiva
  correctResult?: { coef: number; exp: number }[]
}

// Genera un numero aleatorio entre min y max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Genera ejercicios de factorizacion aleatorios con niveles diferenciados
function generateFactorizationExercise(level: DifficultyLevel): GeneratedExercise {
  // Nivel 1 (Basico): Solo factor comun (numerico O exponente, no ambos)
  // Nivel 2 (Intermedio): Polinomios notables (diff cuadrados, TCP)
  // Nivel 3 (Avanzado): Mixtos hasta 3 metodos (sin dos notables distintos)
  
  if (level === 1) {
    // Basico: Factor comun simple
    const useNumeric = Math.random() < 0.5
    
    if (useNumeric) {
      // Solo factor comun numerico: k(ax + b)
      const k = randomInt(2, 5)
      const a = randomInt(1, 4)
      const b = randomInt(1, 5) * (Math.random() < 0.3 ? -1 : 1)
      const terms = [
        { coef: k * a, exp: 1 },
        { coef: k * b, exp: 0 }
      ]
      return { 
        terms, 
        description: "Factor comun numerico", 
        methods: ["factorComunNum"],
        correctAnswer: { factorComun: { numeric: k, exp: 0 } }
      }
    } else {
      // Solo factor comun con x: x^n(ax + b)
      const n = randomInt(1, 2)
      const a = randomInt(1, 4)
      const b = randomInt(1, 5) * (Math.random() < 0.3 ? -1 : 1)
      const terms = [
        { coef: a, exp: n + 1 },
        { coef: b, exp: n }
      ]
      return { 
        terms, 
        description: "Factor comun con x", 
        methods: ["factorComunExp"],
        correctAnswer: { factorComun: { numeric: 1, exp: n } }
      }
    }
  }
  
  if (level === 2) {
    // Intermedio: Polinomios notables puros
    const type = Math.random() < 0.5 ? "diffCuadrados" : "tcp"
    
    if (type === "diffCuadrados") {
      // Diferencia de cuadrados: a²x² - b²
      const a = randomInt(1, 4)
      const b = randomInt(1, 6)
      const terms = [
        { coef: a * a, exp: 2 },
        { coef: -(b * b), exp: 0 }
      ]
      return { 
        terms, 
        description: "Diferencia de cuadrados", 
        methods: ["diffCuadrados"],
        correctAnswer: {
          binomio1: { a, b, sign: "-" },
          binomio2: { a, b, sign: "+" }
        }
      }
    } else {
      // Trinomio cuadrado perfecto: a²x² ± 2abx + b²
      const a = randomInt(1, 3)
      const b = randomInt(1, 5)
      const sign = Math.random() < 0.5 ? 1 : -1
      const terms = [
        { coef: a * a, exp: 2 },
        { coef: sign * 2 * a * b, exp: 1 },
        { coef: b * b, exp: 0 }
      ]
      return { 
        terms, 
        description: "Trinomio cuadrado perfecto", 
        methods: ["tcp"],
        correctAnswer: {
          binomio1: { a, b, sign: sign > 0 ? "+" : "-" },
          squared: true
        }
      }
    }
  }
  
  // Nivel 3 (Avanzado): Combinaciones (sin dos notables distintos)
  const types = ["fcNum_diffCuadrados", "fcExp_diffCuadrados", "fcNum_tcp", "fcExp_tcp", "fcNumExp_diffCuadrados", "fcNumExp_tcp"]
  const type = types[randomInt(0, types.length - 1)]
  
  switch (type) {
    case "fcNum_diffCuadrados": {
      // k(a²x² - b²)
      const k = randomInt(2, 5)
      const a = randomInt(1, 3)
      const b = randomInt(1, 4)
      const terms = [
        { coef: k * a * a, exp: 2 },
        { coef: -k * b * b, exp: 0 }
      ]
      return { 
        terms, 
        description: "Factor comun + diferencia de cuadrados", 
        methods: ["factorComunNum", "diffCuadrados"],
        correctAnswer: {
          factorComun: { numeric: k, exp: 0 },
          binomio1: { a, b, sign: "-" },
          binomio2: { a, b, sign: "+" }
        }
      }
    }
    
    case "fcExp_diffCuadrados": {
      // x^n(a²x² - b²)
      const n = randomInt(1, 2)
      const a = randomInt(1, 3)
      const b = randomInt(1, 4)
      const terms = [
        { coef: a * a, exp: 2 + n },
        { coef: -(b * b), exp: n }
      ]
      return { 
        terms, 
        description: "Factor comun + diferencia de cuadrados", 
        methods: ["factorComunExp", "diffCuadrados"],
        correctAnswer: {
          factorComun: { numeric: 1, exp: n },
          binomio1: { a, b, sign: "-" },
          binomio2: { a, b, sign: "+" }
        }
      }
    }
    
    case "fcNum_tcp": {
      // k(a²x² ± 2abx + b²)
      const k = randomInt(2, 4)
      const a = randomInt(1, 3)
      const b = randomInt(1, 4)
      const sign = Math.random() < 0.5 ? 1 : -1
      const terms = [
        { coef: k * a * a, exp: 2 },
        { coef: k * sign * 2 * a * b, exp: 1 },
        { coef: k * b * b, exp: 0 }
      ]
      return { 
        terms, 
        description: "Factor comun + trinomio cuadrado perfecto", 
        methods: ["factorComunNum", "tcp"],
        correctAnswer: {
          factorComun: { numeric: k, exp: 0 },
          binomio1: { a, b, sign: sign > 0 ? "+" : "-" },
          squared: true
        }
      }
    }
    
    case "fcExp_tcp": {
      // x^n(a²x² ± 2abx + b²)
      const n = randomInt(1, 2)
      const a = randomInt(1, 3)
      const b = randomInt(1, 4)
      const sign = Math.random() < 0.5 ? 1 : -1
      const terms = [
        { coef: a * a, exp: 2 + n },
        { coef: sign * 2 * a * b, exp: 1 + n },
        { coef: b * b, exp: n }
      ]
      return { 
        terms, 
        description: "Factor comun + trinomio cuadrado perfecto", 
        methods: ["factorComunExp", "tcp"],
        correctAnswer: {
          factorComun: { numeric: 1, exp: n },
          binomio1: { a, b, sign: sign > 0 ? "+" : "-" },
          squared: true
        }
      }
    }
    
    case "fcNumExp_diffCuadrados": {
      // kx^n(a²x² - b²) - 3 metodos
      const k = randomInt(2, 4)
      const n = randomInt(1, 2)
      const a = randomInt(1, 2)
      const b = randomInt(1, 3)
      const terms = [
        { coef: k * a * a, exp: 2 + n },
        { coef: -k * b * b, exp: n }
      ]
      return { 
        terms, 
        description: "Factor comun (numerico y exponente) + diferencia de cuadrados", 
        methods: ["factorComunNum", "factorComunExp", "diffCuadrados"],
        correctAnswer: {
          factorComun: { numeric: k, exp: n },
          binomio1: { a, b, sign: "-" },
          binomio2: { a, b, sign: "+" }
        }
      }
    }
    
    case "fcNumExp_tcp": {
      // kx^n(a²x² ± 2abx + b²) - 3 metodos
      const k = randomInt(2, 3)
      const n = randomInt(1, 2)
      const a = randomInt(1, 2)
      const b = randomInt(1, 3)
      const sign = Math.random() < 0.5 ? 1 : -1
      const terms = [
        { coef: k * a * a, exp: 2 + n },
        { coef: k * sign * 2 * a * b, exp: 1 + n },
        { coef: k * b * b, exp: n }
      ]
      return { 
        terms, 
        description: "Factor comun (numerico y exponente) + TCP", 
        methods: ["factorComunNum", "factorComunExp", "tcp"],
        correctAnswer: {
          factorComun: { numeric: k, exp: n },
          binomio1: { a, b, sign: sign > 0 ? "+" : "-" },
          squared: true
        }
      }
    }
    
    default:
      return generateFactorizationExercise(level)
  }
}

// Genera ejercicios de distributiva aleatorios
function generateDistributivaExercise(level: DifficultyLevel): GeneratedExercise {
  // Nivel 1: Binomios simples con coeficiente 1
  // Nivel 2: Binomios con coeficientes y negativos
  // Nivel 3: Trinomio por binomio, coeficientes mayores
  
  if (level === 1) {
    // (x + a)(x + b) - solo positivos
    const a = randomInt(1, 6)
    const b = randomInt(1, 6)
    const result = [
      { coef: 1, exp: 2 },
      { coef: a + b, exp: 1 },
      { coef: a * b, exp: 0 }
    ]
    return {
      terms: [{ coef: 1, exp: 1 }, { coef: a, exp: 0 }],
      terms2: [{ coef: 1, exp: 1 }, { coef: b, exp: 0 }],
      description: "Producto de binomios simples",
      methods: ["distributiva"],
      correctResult: result
    }
  }
  
  if (level === 2) {
    const type = Math.random() < 0.5 ? "conCoef" : "conNegativo"
    
    if (type === "conCoef") {
      // (ax + b)(cx + d)
      const a = randomInt(2, 3)
      const b = randomInt(1, 5)
      const c = randomInt(1, 3)
      const d = randomInt(1, 5)
      const result = [
        { coef: a * c, exp: 2 },
        { coef: a * d + b * c, exp: 1 },
        { coef: b * d, exp: 0 }
      ]
      return {
        terms: [{ coef: a, exp: 1 }, { coef: b, exp: 0 }],
        terms2: [{ coef: c, exp: 1 }, { coef: d, exp: 0 }],
        description: "Binomios con coeficientes",
        methods: ["distributiva"],
        correctResult: result
      }
    } else {
      // (x - a)(x + b) o (x + a)(x - b)
      const a = randomInt(1, 6)
      const b = randomInt(1, 6)
      const signA = Math.random() < 0.5 ? 1 : -1
      const signB = -signA
      const result = [
        { coef: 1, exp: 2 },
        { coef: signA * a + signB * b, exp: 1 },
        { coef: signA * a * signB * b, exp: 0 }
      ]
      return {
        terms: [{ coef: 1, exp: 1 }, { coef: signA * a, exp: 0 }],
        terms2: [{ coef: 1, exp: 1 }, { coef: signB * b, exp: 0 }],
        description: "Binomios con signos mixtos",
        methods: ["distributiva"],
        correctResult: result
      }
    }
  }
  
  // Nivel 3: Trinomio por binomio o binomios con coef mayores y negativos
  const type = Math.random() < 0.6 ? "trinomio" : "binomioComplejo"
  
  if (type === "trinomio") {
    // (ax² + bx + c)(dx + e)
    const a = randomInt(1, 2)
    const b = randomInt(-4, 4)
    const c = randomInt(-4, 4)
    const d = randomInt(1, 2)
    const e = randomInt(-4, 4)
    
    if (b === 0 || c === 0 || e === 0) {
      return generateDistributivaExercise(level) // Regenerar si hay ceros
    }
    
    const result = [
      { coef: a * d, exp: 3 },
      { coef: a * e + b * d, exp: 2 },
      { coef: b * e + c * d, exp: 1 },
      { coef: c * e, exp: 0 }
    ].filter(t => t.coef !== 0)
    
    return {
      terms: [{ coef: a, exp: 2 }, { coef: b, exp: 1 }, { coef: c, exp: 0 }],
      terms2: [{ coef: d, exp: 1 }, { coef: e, exp: 0 }],
      description: "Trinomio por binomio",
      methods: ["distributiva"],
      correctResult: result
    }
  } else {
    // (ax + b)(cx + d) con coeficientes mayores y posibles negativos
    const a = randomInt(2, 4)
    const b = randomInt(-5, 5)
    const c = randomInt(2, 4)
    const d = randomInt(-5, 5)
    
    if (b === 0 || d === 0) {
      return generateDistributivaExercise(level)
    }
    
    const result = [
      { coef: a * c, exp: 2 },
      { coef: a * d + b * c, exp: 1 },
      { coef: b * d, exp: 0 }
    ].filter(t => t.coef !== 0)
    
    return {
      terms: [{ coef: a, exp: 1 }, { coef: b, exp: 0 }],
      terms2: [{ coef: c, exp: 1 }, { coef: d, exp: 0 }],
      description: "Binomios con coeficientes grandes",
      methods: ["distributiva"],
      correctResult: result
    }
  }
}

function Practica() {
  const [mode, setMode] = useState<PracticaMode>("factorizacion")
  const [level, setLevel] = useState<DifficultyLevel>(1)
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  
  // Estado para la respuesta del usuario
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Genera un nuevo ejercicio
  const generateNewExercise = useCallback(() => {
    const newExercise = mode === "factorizacion" 
      ? generateFactorizationExercise(level)
      : generateDistributivaExercise(level)
    setExercise(newExercise)
    setUserAnswer("")
    setFeedback(null)
    setShowSolution(false)
    setCurrentStep(0)
  }, [mode, level])

  // Generar ejercicio inicial
  useEffect(() => {
    generateNewExercise()
  }, [mode, level, generateNewExercise])

  // Renderiza el polinomio con formato bonito
  const renderPolynomial = (termsList: { coef: number; exp: number }[]) => {
    const sorted = [...termsList].sort((a, b) => b.exp - a.exp).filter(t => t.coef !== 0)
    if (sorted.length === 0) return <span>0</span>
    return sorted.map((t, i) => {
      const isFirst = i === 0
      const absCoef = Math.abs(t.coef)
      const sign = isFirst 
        ? (t.coef < 0 ? "-" : "") 
        : (t.coef < 0 ? " - " : " + ")
      
      if (t.exp === 0) {
        return <span key={i}>{sign}{absCoef}</span>
      }
      
      const coefStr = absCoef === 1 ? "" : absCoef
      
      if (t.exp === 1) {
        return <span key={i}>{sign}{coefStr}x</span>
      }
      
      return (
        <span key={i}>
          {sign}{coefStr}x<Sup>{t.exp}</Sup>
        </span>
      )
    })
  }

  // Obtiene la respuesta correcta como texto
  const getCorrectAnswerText = (): string => {
    if (!exercise) return ""
    
    if (mode === "distributiva" && exercise.correctResult) {
      const sorted = [...exercise.correctResult].sort((a, b) => b.exp - a.exp)
      return sorted.map((t, i) => {
        const isFirst = i === 0
        const absCoef = Math.abs(t.coef)
        const sign = isFirst ? (t.coef < 0 ? "-" : "") : (t.coef < 0 ? " - " : " + ")
        
        if (t.exp === 0) return `${sign}${absCoef}`
        const coefStr = absCoef === 1 ? "" : absCoef
        if (t.exp === 1) return `${sign}${coefStr}x`
        return `${sign}${coefStr}x^${t.exp}`
      }).join("")
    }
    
    if (mode === "factorizacion" && exercise.correctAnswer) {
      const ans = exercise.correctAnswer
      let result = ""
      
      // Factor comun
      if (ans.factorComun) {
        if (ans.factorComun.numeric > 1 && ans.factorComun.exp > 0) {
          result += `${ans.factorComun.numeric}x${ans.factorComun.exp > 1 ? `^${ans.factorComun.exp}` : ""}`
        } else if (ans.factorComun.numeric > 1) {
          result += `${ans.factorComun.numeric}`
        } else if (ans.factorComun.exp > 0) {
          result += `x${ans.factorComun.exp > 1 ? `^${ans.factorComun.exp}` : ""}`
        }
      }
      
      // Binomios
      if (ans.binomio1) {
        const aStr = ans.binomio1.a === 1 ? "x" : `${ans.binomio1.a}x`
        if (ans.squared) {
          result += `(${aStr} ${ans.binomio1.sign} ${ans.binomio1.b})^2`
        } else if (ans.binomio2) {
          const aStr2 = ans.binomio2.a === 1 ? "x" : `${ans.binomio2.a}x`
          result += `(${aStr} ${ans.binomio1.sign} ${ans.binomio1.b})(${aStr2} ${ans.binomio2.sign} ${ans.binomio2.b})`
        }
      } else if (ans.factorComun) {
        // Solo factor comun - calcular lo que queda
        const normalized = [...exercise.terms].sort((a, b) => b.exp - a.exp)
        const remaining = normalized.map(t => ({
          coef: t.coef / (ans.factorComun?.numeric || 1),
          exp: t.exp - (ans.factorComun?.exp || 0)
        }))
        const remainingStr = remaining.map((t, i) => {
          const isFirst = i === 0
          const absCoef = Math.abs(t.coef)
          const sign = isFirst ? (t.coef < 0 ? "-" : "") : (t.coef < 0 ? " - " : " + ")
          if (t.exp === 0) return `${sign}${absCoef}`
          const coefStr = absCoef === 1 ? "" : absCoef
          if (t.exp === 1) return `${sign}${coefStr}x`
          return `${sign}${coefStr}x^${t.exp}`
        }).join("")
        result += `(${remainingStr})`
      }
      
      return result
    }
    
    return ""
  }

  // Normaliza una respuesta para comparacion
  const normalizeAnswer = (answer: string): string => {
    return answer
      .replace(/\s+/g, "")
      .replace(/−/g, "-")
      .replace(/·/g, "*")
      .replace(/\*\*/g, "^")
      .toLowerCase()
  }

  // Verifica la respuesta del usuario
  const checkAnswer = () => {
    if (!exercise || !userAnswer.trim()) return
    
    const correct = getCorrectAnswerText()
    const userNorm = normalizeAnswer(userAnswer)
    const correctNorm = normalizeAnswer(correct)
    
    // Para factorizacion, aceptar diferentes ordenes de factores
    let isCorrect = userNorm === correctNorm
    
    // Verificaciones adicionales para factorizacion
    if (!isCorrect && mode === "factorizacion") {
      // Permitir orden inverso de binomios en diferencia de cuadrados
      if (exercise.correctAnswer?.binomio1 && exercise.correctAnswer?.binomio2) {
        const b1 = exercise.correctAnswer.binomio1
        const b2 = exercise.correctAnswer.binomio2
        const aStr = b1.a === 1 ? "x" : `${b1.a}x`
        const altOrder = normalizeAnswer(`(${aStr}${b2.sign}${b2.b})(${aStr}${b1.sign}${b1.b})`)
        
        // Tambien con factor comun
        if (exercise.correctAnswer.factorComun) {
          const fc = exercise.correctAnswer.factorComun
          let fcStr = ""
          if (fc.numeric > 1 && fc.exp > 0) {
            fcStr = `${fc.numeric}x${fc.exp > 1 ? `^${fc.exp}` : ""}`
          } else if (fc.numeric > 1) {
            fcStr = `${fc.numeric}`
          } else if (fc.exp > 0) {
            fcStr = `x${fc.exp > 1 ? `^${fc.exp}` : ""}`
          }
          const altWithFc = normalizeAnswer(`${fcStr}(${aStr}${b2.sign}${b2.b})(${aStr}${b1.sign}${b1.b})`)
          isCorrect = userNorm === altOrder || userNorm === altWithFc
        } else {
          isCorrect = userNorm === altOrder
        }
      }
    }
    
    setFeedback(isCorrect ? "correct" : "incorrect")
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
  }

  // Calcula los pasos de la solucion
  const calculateSolutionSteps = (): { description: string; expression: React.ReactNode }[] => {
    if (!exercise) return []
    
    const steps: { description: string; expression: React.ReactNode }[] = []
    
    if (mode === "distributiva") {
      const poly1 = [...exercise.terms].sort((a, b) => b.exp - a.exp).filter(t => t.coef !== 0)
      const poly2 = [...(exercise.terms2 || [])].sort((a, b) => b.exp - a.exp).filter(t => t.coef !== 0)
      
      steps.push({
        description: "Aplicamos la propiedad distributiva",
        expression: (
          <div className="text-xl font-mono">
            <span className="text-blue-600">({renderPolynomial(poly1)})</span>
            <span className="mx-2">·</span>
            <span className="text-green-600">({renderPolynomial(poly2)})</span>
          </div>
        ),
      })
      
      const allProducts: { coef: number; exp: number }[] = []
      poly1.forEach((t1) => {
        poly2.forEach((t2) => {
          allProducts.push({ coef: t1.coef * t2.coef, exp: t1.exp + t2.exp })
        })
      })
      
      steps.push({
        description: "Multiplicamos cada termino del primero por cada termino del segundo",
        expression: <div className="text-xl font-mono">{renderPolynomial(allProducts)}</div>,
      })
      
      if (exercise.correctResult) {
        steps.push({
          description: "Combinamos terminos semejantes",
          expression: (
            <div className="text-2xl font-bold font-mono text-green-600">
              {renderPolynomial(exercise.correctResult)}
            </div>
          ),
        })
      }
    } else {
      // Factorizacion
      const normalized = [...exercise.terms].sort((a, b) => b.exp - a.exp)
      
      steps.push({
        description: "Comenzamos con el polinomio",
        expression: <span className="text-xl font-mono">{renderPolynomial(normalized)}</span>,
      })
      
      if (exercise.correctAnswer?.factorComun) {
        const fc = exercise.correctAnswer.factorComun
        let fcStr = ""
        if (fc.numeric > 1 && fc.exp > 0) {
          fcStr = `${fc.numeric}x${fc.exp > 1 ? `^${fc.exp}` : ""}`
        } else if (fc.numeric > 1) {
          fcStr = `${fc.numeric}`
        } else if (fc.exp > 0) {
          fcStr = `x${fc.exp > 1 ? `^${fc.exp}` : ""}`
        }
        
        if (fc.numeric > 1) {
          const coefficients = normalized.map(t => Math.abs(t.coef))
          steps.push({
            description: `Identificamos el MCD de los coeficientes: MCD(${coefficients.join(", ")}) = ${fc.numeric}`,
            expression: (
              <div className="text-xl font-mono">
                Factor numerico: <span className="font-bold text-blue-600">{fc.numeric}</span>
              </div>
            ),
          })
        }
        
        if (fc.exp > 0) {
          steps.push({
            description: `Identificamos el factor comun con x: el menor exponente es ${fc.exp}`,
            expression: (
              <div className="text-xl font-mono">
                Factor con x: <span className="font-bold text-green-600">x{fc.exp > 1 ? <Sup>{fc.exp}</Sup> : ""}</span>
              </div>
            ),
          })
        }
        
        const remaining = normalized.map(t => ({
          coef: t.coef / fc.numeric,
          exp: t.exp - fc.exp
        }))
        
        steps.push({
          description: `Extraemos el factor comun ${fcStr}`,
          expression: (
            <div className="text-xl font-mono">
              <span className="text-blue-600">{fcStr}</span>({renderPolynomial(remaining)})
            </div>
          ),
        })
      }
      
      if (exercise.correctAnswer?.binomio1) {
        const b1 = exercise.correctAnswer.binomio1
        const aStr = b1.a === 1 ? "x" : `${b1.a}x`
        
        if (exercise.correctAnswer.squared) {
          steps.push({
            description: "Reconocemos un trinomio cuadrado perfecto: a² ± 2ab + b² = (a ± b)²",
            expression: (
              <div className="text-xl font-mono">
                a = <span className="text-blue-600">{aStr}</span>, b = <span className="text-green-600">{b1.b}</span>
              </div>
            ),
          })
        } else if (exercise.correctAnswer.binomio2) {
          steps.push({
            description: "Reconocemos una diferencia de cuadrados: a² - b² = (a - b)(a + b)",
            expression: (
              <div className="text-xl font-mono">
                a = <span className="text-blue-600">{aStr}</span>, b = <span className="text-green-600">{b1.b}</span>
              </div>
            ),
          })
        }
      }
      
      steps.push({
        description: "Resultado final",
        expression: (
          <div className="text-2xl font-bold font-mono text-green-600">
            {getCorrectAnswerText()}
          </div>
        ),
      })
    }
    
    return steps
  }

  const solutionSteps = showSolution ? calculateSolutionSteps() : []
  const totalSteps = solutionSteps.length

  const levelNames = { 1: "Basico", 2: "Intermedio", 3: "Avanzado" }
  const levelDescriptions = {
    1: mode === "factorizacion" ? "Factor comun (numerico o exponente)" : "Binomios simples (x + a)(x + b)",
    2: mode === "factorizacion" ? "Productos notables (diferencia de cuadrados, TCP)" : "Binomios con coeficientes y negativos",
    3: mode === "factorizacion" ? "Combinados (hasta 3 metodos)" : "Trinomio por binomio, coeficientes grandes"
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Practica</h2>
            <p className="text-sm text-slate-600">
              Resolve los ejercicios y verifica tus respuestas
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Puntaje</p>
            <p className="text-2xl font-bold">
              <span className="text-green-600">{score.correct}</span>
              <span className="text-slate-400"> / </span>
              <span className="text-blue-600">{score.total}</span>
            </p>
          </div>
        </div>

        {/* Selector de modo y nivel */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button 
              variant={mode === "factorizacion" ? "default" : "outline"}
              size="sm"
              onClick={() => { setMode("factorizacion"); setScore({ correct: 0, total: 0 }); }}
            >
              Factorizacion
            </Button>
            <Button 
              variant={mode === "distributiva" ? "default" : "outline"}
              size="sm"
              onClick={() => { setMode("distributiva"); setScore({ correct: 0, total: 0 }); }}
            >
              Distributiva
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Nivel:</span>
            {([1, 2, 3] as DifficultyLevel[]).map(l => (
              <Button
                key={l}
                variant={level === l ? "default" : "outline"}
                size="sm"
                onClick={() => setLevel(l)}
              >
                {levelNames[l]}
              </Button>
            ))}
          </div>
          <p className="text-xs text-slate-500">{levelDescriptions[level]}</p>
        </div>

        {/* Ejercicio actual */}
        {exercise && (
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500 mb-4">
              {mode === "factorizacion" ? "Factoriza el siguiente polinomio:" : "Resuelve la siguiente multiplicacion:"}
            </p>
            
            <div className="text-3xl font-bold font-mono text-center py-6">
              {mode === "factorizacion" ? (
                renderPolynomial(exercise.terms)
              ) : (
                <>
                  <span className="text-blue-600">({renderPolynomial(exercise.terms)})</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-green-600">({renderPolynomial(exercise.terms2 || [])})</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input de respuesta */}
        {!feedback && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tu respuesta:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                placeholder={mode === "factorizacion" ? "Ej: 3(x + 2) o (x - 3)(x + 3)" : "Ej: x^2 + 5x + 6"}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-slate-400 mt-1">
                Usa ^ para exponentes (ej: x^2), - para resta, * o nada para multiplicacion
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                Verificar
              </Button>
              <Button variant="outline" onClick={() => setShowSolution(true)}>
                Ver solucion
              </Button>
              <Button variant="ghost" onClick={generateNewExercise}>
                Saltar
              </Button>
            </div>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {feedback === "correct" ? (
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-center">
                  <p className="text-xl font-bold text-green-600 mb-2">Correcto!</p>
                  <p className="text-green-700">{getCorrectAnswerText()}</p>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-xl font-bold text-red-600 mb-2">Incorrecto</p>
                  <p className="text-slate-600 mb-2">Tu respuesta: <span className="font-mono">{userAnswer}</span></p>
                  <p className="text-green-700">Respuesta correcta: <span className="font-mono font-bold">{getCorrectAnswerText()}</span></p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setShowSolution(true)}
                  >
                    Ver explicacion
                  </Button>
                </div>
              )}
              
              <div className="flex gap-3 mt-4">
                <Button onClick={generateNewExercise}>
                  Siguiente ejercicio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solucion paso a paso */}
        <AnimatePresence>
          {showSolution && solutionSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-blue-600">
                      Paso {currentStep + 1} de {totalSteps}
                    </p>
                    <p className="text-lg font-medium">
                      {solutionSteps[currentStep].description}
                    </p>
                    <div className="py-4 flex justify-center">
                      {solutionSteps[currentStep].expression}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Anterior
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                  disabled={currentStep === totalSteps - 1}
                >
                  Siguiente
                </Button>
              </div>

              {!feedback && (
                <div className="flex gap-3 mt-4">
                  <Button onClick={generateNewExercise}>
                    Nuevo ejercicio
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default function MathMiniApp() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">
            Visualización de la propiedad distributiva y la factorización
          </h1>
          <p className="mt-2 text-slate-600">
            Herramienta interactiva paso a paso para alumnos de secundaria: flechas curvas,
            colores por término y resolución progresiva.
          </p>
        </section>

        <Tabs defaultValue="distributiva" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="distributiva">Distributiva</TabsTrigger>
            <TabsTrigger value="factorizacion">Factorización</TabsTrigger>
            <TabsTrigger value="practica">Práctica</TabsTrigger>
          </TabsList>
          <TabsContent value="distributiva" className="mt-4">
            <Distributiva />
          </TabsContent>
          <TabsContent value="factorizacion" className="mt-4">
            <Factorizacion />
          </TabsContent>
          <TabsContent value="practica" className="mt-4">
            <Practica />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
